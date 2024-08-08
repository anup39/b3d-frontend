import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
// import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Flex, Grid, Modal, TextInput, Select } from "@mantine/core";
// import { ComboboxItem, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import xml2js from "xml2js";
import Map from "../map/Map";
import MapLibreGL from "maplibre-gl";

const Public = () => {
  const token = "061e2302db3bc927353b010889585017";
  const targetUrl =
    //  `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=${token}`;
    `https://api.dataforsyningen.dk/wfs/MatGaeldendeOgForeloebigWFS_DAF?service=WFS&request=GetCapabilities&token=${token}`;

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
  const [value, setValue] = useState(null);

  const fetchLayers = async (xmlUrl) => {
    const withToken = `${xmlUrl}&token=${token}`;
    console.log(xmlUrl);

    try {
      const response = await fetch(withToken);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }
      const xmlText = await response.text();
      //   console.log(xmlText);

      xml2js.parseString(xmlText, (err, result) => {
        // console.log(result);
        if (err) {
          console.error("Error parsing XML:", err);
          setError(err);
          return;
        } else {
          //   const featuresFromXmlParsed =
          //     result["wfs:WFS_Capabilities"]["wfs:FeatureTypeList"][0][
          //       "wfs:FeatureType"
          //     ];
          //   console.log(featuresFromXmlParsed, "result");
          //   setFeatures(featuresFromXmlParsed);
          const layersFromXmlParsed =
            result?.WMS_Capabilities?.Capability[0]?.Layer[0]?.Layer;
          setLayers(layersFromXmlParsed);
        }
      });
    } catch (error) {
      console.error("Error fetching WMS layers:", error);
    }
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      service: "",
      xmlUrl: "",
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
                  className="bg-[#4b4a42] text-[#ffffff] px-[0.5rem] py-[0.3rem] text-[0.8rem] cursor-pointer"
                  key={index}
                >
                  {layer?.Name[0]}
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
