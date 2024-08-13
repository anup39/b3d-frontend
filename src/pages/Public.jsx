import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Flex, Grid, Modal, TextInput, Select } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import xml2js from "xml2js";
import Map from "../map/Map";
import MapLibreGL from "maplibre-gl";
import AddRasterToMap from "../maputils/AddRasterToMap";
import RemoveSourceAndLayerFromMap from "../maputils/RemoveSourceAndLayerFromMap";

const Public = () => {
  const token = "061e2302db3bc927353b010889585017";
  const targetUrl = `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=061e2302db3bc927353b010889585017`;
  // `https://api.dataforsyningen.dk/wfs/MatGaeldendeOgForeloebigWFS_DAF?service=WFS&request=GetCapabilities&token=061e2302db3bc927353b010889585017`;

  const [layers, setLayers] = useState([]);

  const map = window.map_global;
  const popUpRef = useRef(new MapLibreGL.Popup({ closeOnClick: false }));

  const { t } = useTranslation();
  const [isLayersFormOpened, { open: openLayersForm, close: closeLayersForm }] =
    useDisclosure(false);
  const [
    isLayersModalOpened,
    { open: openLayersModal, close: closeLayersModal },
  ] = useDisclosure(false);
  const [value, toggle] = useToggle(["add", "remove"]);

  // parse url
  function parseUrl(url) {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    const queryParams = {};
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    let serviceType = "";
    if (baseUrl.includes("/wfs/")) {
      serviceType = "WFS";
    } else if (baseUrl.includes("/wms/")) {
      serviceType = "WMS";
    } else {
      serviceType = "Unknown";
    }
    return {
      baseUrl,
      queryParams,
      serviceType,
    };
  }

  // get layerDetails from xml
  const fetchLayers = async (xmlUrl) => {
    const { baseUrl, queryParams, serviceType } = parseUrl(xmlUrl);
    try {
      const response = await fetch(xmlUrl);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }
      const xmlText = await response.text();
      xml2js.parseString(xmlText, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          setError(err);
          return;
        } else {
          console.log(result);
          let version = "1.1.1";
          let layersFromXmlParsed = [];
          // if (result["wfs:WFS_Capabilities"]) {
          //   layersFromXmlParsed =
          //     result["wfs:WFS_Capabilities"]["wfs:FeatureTypeList"][0][
          //       "wfs:FeatureType"
          //     ];
          // }
          if (result?.WMS_Capabilities) {
            layersFromXmlParsed =
              result?.WMS_Capabilities?.Capability[0]?.Layer[0]?.Layer;
            version = result?.WMS_Capabilities.$.version;
          }
          if (result?.WMT_MS_Capabilities) {
            layersFromXmlParsed =
              result?.WMT_MS_Capabilities?.Capability[0]?.Layer[0]?.Layer;
            version = result?.WMT_MS_Capabilities.$.version;
          }
          const layerDetails = layersFromXmlParsed.map((layer, index) => {
            let bboxParams;
            const layerName = layer.Name[0];
            const crs = layer.CRS ? layer.CRS[0] : null;
            const srs = layer.SRS ? layer.SRS[0] : null;

            // use BoundingBox
            if (layer.LatLonBoundingBox && layer.LatLonBoundingBox.length > 0) {
              // use LatLonBoundingBox
              const latLonBbox = layer.LatLonBoundingBox[0].$;
              bboxParams = [
                latLonBbox.minx,
                latLonBbox.miny,
                latLonBbox.maxx,
                latLonBbox.maxy,
              ];
            } else if (
              layer.EX_GeographicBoundingBox &&
              layer.EX_GeographicBoundingBox.length > 0
            ) {
              // Use EX_GeographicBoundingBox
              const exGeoBbox = layer.EX_GeographicBoundingBox[0];
              bboxParams = [
                exGeoBbox.westBoundLongitude[0],
                exGeoBbox.southBoundLatitude[0],
                exGeoBbox.eastBoundLongitude[0],
                exGeoBbox.northBoundLatitude[0],
              ];
            }
            return {
              version,
              crs,
              srs,
              layerName,
              bbox: bboxParams,
              baseUrl,
              ...queryParams,
              isAdded: false,
            };
          });
          setLayers(layerDetails);
        }
      });
    } catch (error) {
      console.error("Error fetching WMS layers:", error);
    }
  };

  const getlayerUrl = (layerParams) => {
    const { baseUrl, service, version, layerName, bbox } = layerParams;
    console.log(layerParams, "layerparams");
    const url = new URL(baseUrl);
    url.searchParams.append("service", service);
    url.searchParams.append("request", "GetMap");
    url.searchParams.append("version", version);
    url.searchParams.append("layers", layerName);
    url.searchParams.append("bbox", bbox);
    url.searchParams.append("format", "image/png");
    url.searchParams.append("transparent", "TRUE");
    url.searchParams.append("width", "800");
    url.searchParams.append("height", "600");
    if (layerParams.crs) {
      url.searchParams.append("crs", layerParams?.crs);
    } else {
      url.searchParams.append("srs", layerParams?.srs);
    }
    if (layerParams.token) {
      url.searchParams.append("token", layerParams?.token);
    }
    const layerUrl = decodeURIComponent(url.toString());
    console.log(layerUrl, "layerUrl");
    return layerUrl;
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      service: "WMS",
      xmlUrl:
        "https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=061e2302db3bc927353b010889585017",
    },
  });

  const handleSubmitLayersForm = async (values) => {
    const { xmlUrl } = values;
    await fetchLayers(xmlUrl).then(() => {
      form.reset();
      closeLayersForm();
      openLayersModal();
    });
  };

  const toggleLayer = (layer) => {
    const { layerName, bbox, isAdded } = layer;
    const layerUrl = getlayerUrl(layer);
    if (map) {
      if (isAdded) {
        RemoveSourceAndLayerFromMap({
          map,
          layerId: `${layerName}`,
          source: `${layerName}`,
        });
      } else {
        AddRasterToMap({
          map,
          layerId: `${layerName}`,
          sourceId: `${layerName}`,
          url: layerUrl,
          zoomToLayer: true,
          extent: bbox,
          type: "raster",
          component: "Public",
        });
      }
      setLayers(
        layers?.map((layer) => {
          if (layerName === layer?.layerName) {
            return { ...layer, isAdded: !isAdded };
          }
          return layer;
        })
      );
    } else {
      console.log("map not loaded");
    }
  };

  return (
    <div style={{ backgroundColor: "#F2F6F8", padding: "1rem" }}>
      <Button
        w="16rem"
        size="compact-lg"
        onClick={openLayersForm}
        variant="contained"
      >
        {t("Add") + " " + t("Layers")}
      </Button>
      <Modal
        opened={isLayersFormOpened}
        onClose={closeLayersForm}
        title={"Add Layers"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmitLayersForm(values);
          })}
          style={{
            background: "#fff",
            paddingTop: "1rem",
            zIndex: 10000,
          }}
        >
          <Grid container spacing={2}>
            <Grid.Col>
              <Select
                label="Service"
                placeholder="Select Service"
                defaultValue="WMS"
                clearable
                data={[
                  { value: "WMS", label: "WMS" },
                  { value: "WFS", label: "WFS" },
                  { value: "WMTS", label: "WMTS" },
                ]}
                {...form.getInputProps("service")}
              />
              <TextInput
                required
                mt={"1rem"}
                label="Xml Url"
                description="Add a xml url for public borders"
                key={form.key("xmlUrl")}
                {...form.getInputProps("xmlUrl")}
              />
            </Grid.Col>

            <Grid.Col>
              <Button type="submit" mt="2rem" fullWidth className="bg-blue-500">
                Get Layers
              </Button>
            </Grid.Col>
            <Grid.Col>
              <Button color="red" fullWidth>
                Cancel
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
      <Modal
        opened={isLayersModalOpened}
        onClose={() => closeLayersModal(false)}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={"100%"}
        // withCloseButton={false}
      >
        <Grid style={{ height: "100%", paddingTop: "1rem" }}>
          <Grid.Col
            span={3}
            style={{ height: "35rem" }}
            className="overflow-scroll scrollbar-thin"
          >
            <div className="text-[1.2rem] font-semibold">Layers</div>
            <Flex direction={"column"} gap="0.5rem" className="pt-[1rem]">
              {layers?.map((layer, index) => (
                <div
                  onClick={() => {
                    toggleLayer(layer);
                  }}
                  className={`${
                    layer?.isAdded ? "bg-[#c44646]" : "bg-[#4b4a42]"
                  } text-[#ffffff] px-[0.5rem] py-[0.3rem] text-[0.8rem] cursor-pointer`}
                  key={index}
                >
                  {layer?.layerName}
                </div>
              ))}
            </Flex>
          </Grid.Col>
          <Grid.Col span={9} style={{ height: "35rem", padding: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "35rem",
              }}
            >
              <Map popUpRef={popUpRef} />
            </div>
          </Grid.Col>
        </Grid>
      </Modal>
    </div>
  );
};
export default Public;
