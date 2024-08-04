import { Modal, Button, TextInput, Group } from "@mantine/core";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Map from "../../map/Map";
import xml2js from "xml2js";

const token = localStorage.getItem("token");

const targetUrl = `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=${token}`;

const AddPublicBordersForm = () => {
  const [labels, setLabels] = useState([]);
  const [showLabels, setShowLabels] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();
  const [boundingBoxs, setBoundingBoxs] = useState([]);
  const [layers, setLayers] = useState([]);

  const map = window.map_global;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "test",
      xmlUrl: targetUrl,
    },
  });

  const handleSubmit = async (values) => {
    const { name, xmlUrl } = values;
    const withToken = `${xmlUrl}&token=${token}`;

    try {
      const response = await fetch(withToken);
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
          const layersFromXmlParsed =
            result?.WMS_Capabilities?.Capability[0]?.Layer[0]?.Layer;
          setLayers(layersFromXmlParsed);
        }
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const FeatureList = xmlDoc.getElementsByTagName("Layer");

      const itemsArray = [];
      Array.from(FeatureList).forEach((item) => {
        const layerName = item.getElementsByTagName("Name")[0].textContent;
        const boundingBox = item.getElementsByTagName(
          "EX_GeographicBoundingBox"
        )[0];
        const west =
          boundingBox.getElementsByTagName("westBoundLongitude")[0].textContent;
        const east =
          boundingBox.getElementsByTagName("eastBoundLongitude")[0].textContent;
        const south =
          boundingBox.getElementsByTagName("southBoundLatitude")[0].textContent;
        const north =
          boundingBox.getElementsByTagName("northBoundLatitude")[0].textContent;

        const wmsUrl = `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?token=${"061e2302db3bc927353b010889585017"}&version=1.3.0&service=WMS&request=GetMap&layers=${layerName}&styles=default&bbox=${west},${south},${east},${north}&width=256&height=256&crs=EPSG:25832&format=image/png`;

        setBoundingBoxs([
          [parseFloat(west), parseFloat(north)],
          [parseFloat(east), parseFloat(north)],
          [parseFloat(east), parseFloat(south)],
          [parseFloat(west), parseFloat(south)],
        ]);

        itemsArray.push({
          title: layerName,
          layerUrl: wmsUrl,
          coordinates: [
            [west, south],
            [east, north],
          ],
        });
      });

      setLabels(itemsArray);
      setShowLabels(true);
    } catch (error) {
      console.error("Error fetching WMS layers:", error);
      setError(error);
    }
  };

  const handleCloseForm = () => {
    form.reset();
    setLabels([]);
    setShowLabels(false);
    close();
  };

  const addLayers = () => {
    if (map) {
      try {
        layers.forEach((layer, index) => {
          if (layer?.Name && layer?.Style) {
            const layerId = `layer-${index}`;
            const layerName = layer?.Name;

            // source
            map.addSource(layerId, {
              type: "raster",
              tiles: [
                `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetMap&version=1.3.0&crs=EPSG:4326&bbox=-180,-90,180,90&width=800&height=600&layers=${layerName}&format=image/png&token=061e2302db3bc927353b010889585017`,
              ],
              tileSize: 256,
            });

            map.addLayer({
              id: layerId,
              type: "raster",
              source: layerId,
              paint: {
                "raster-opacity": 0.4,
              },
            });
          }
        });
      } catch (error) {
        console.error("Error adding layer:", error);
      }
    }
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={handleCloseForm}
        title={"Add Public Layer"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={"30rem"}
        centered
      >
        <div className="max-h-[30rem] w-[27rem] mb-[1rem]">
          <form
            onSubmit={form.onSubmit((values) => {
              handleSubmit(values);
            })}
          >
            <TextInput
              label="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            ></TextInput>
            <TextInput
              mt={"1rem"}
              label="Xml Url"
              description="Add a xml url for public borders"
              key={form.key("xmlUrl")}
              {...form.getInputProps("xmlUrl")}
            />
            <div className="flex justify-center">
              <Button type="submit" mt="2rem">
                Get Layers
              </Button>
            </div>
          </form>
          {showLabels && (
            <div className="pb-[1rem]">
              {labels?.length > 0 ? (
                <Group className="mt-[1rem] flex fle">
                  {error ? (
                    <h1>{error.message}</h1>
                  ) : (
                    <h1>
                      <span className="font-semibold">
                        Total {form.getValues().name} layers :
                      </span>{" "}
                      {layers?.length}
                    </h1>
                  )}
                  {/* {labels.map((label, index) => (
                    <li
                      className="text-[#444343] bg-[#d2cfcf] w-[100%] px-2 py-[1rem] list-none"
                      key={index}
                    >
                      <span>
                        <span className="font-semibold">Layer Name: </span>
                        {label.title}
                      </span>
                    </li>
                  ))} */}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 "
                    onClick={addLayers}
                  >
                    Add layers
                  </button>
                </Group>
              ) : (
                <div>No Layers Found</div>
              )}
            </div>
          )}

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              height: "14rem",
            }}
          >
            <Map />
          </div>
        </div>
      </Modal>
      <Button bg="#1976d2" px="5px" h="1.6rem" onClick={open}>
        ADD PUBLIC LAYERS
      </Button>
    </div>
  );
};

export default AddPublicBordersForm;
