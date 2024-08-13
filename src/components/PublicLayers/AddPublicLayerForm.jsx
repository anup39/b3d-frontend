import { Modal, Button, TextInput, Group } from "@mantine/core";
import React, { useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Map from "../../map/Map";
import xml2js from "xml2js";
import AddRasterToMap from "../../maputils/AddRasterToMap";
import MapLibreGL from "maplibre-gl";

const AddPublicBordersForm = () => {
  // This is token from subodh's personal account for testing
  const token = "061e2302db3bc927353b010889585017";
  const targetUrl =
    //  `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=${token}`;
    `https://api.dataforsyningen.dk/wfs/MatGaeldendeOgForeloebigWFS_DAF?service=WFS&request=GetCapabilities&token=${token}`;
  const [labels, setLabels] = useState([]);
  const [showLabels, setShowLabels] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();
  const [boundingBoxs, setBoundingBoxs] = useState([]);

  const [features, setFeatures] = useState();

  const map = window.map_global;
  const popUpRef = useRef(new MapLibreGL.Popup({ closeOnClick: false }));

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
          const featuresFromXmlParsed =
            result["wfs:WFS_Capabilities"]["wfs:FeatureTypeList"][0][
              "wfs:FeatureType"
            ];
          console.log(featuresFromXmlParsed, "result");
          setFeatures(featuresFromXmlParsed);
          // const layersFromXmlParsed =
          //   result?.WMS_Capabilities?.Capability[0]?.Layer[0]?.Layer;
          // console.log(layersFromXmlParsed, "result");
          // setLayers(layersFromXmlParsed);
        }
      });

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
        features.forEach((featureType) => {
          const name = featureType["wfs:Name"][0]["_"];
          const boundingBox = featureType["ows:WGS84BoundingBox"][0];
          const lowerCorner = boundingBox["ows:LowerCorner"][0].split(" ");
          const upperCorner = boundingBox["ows:UpperCorner"][0].split(" ");

          const minLng = parseFloat(lowerCorner[0]);
          const minLat = parseFloat(lowerCorner[1]);
          const maxLng = parseFloat(upperCorner[0]);
          const maxLat = parseFloat(upperCorner[1]);

          // Create a GeoJSON feature for the bounding box
          const geoJsonFeature = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [minLng, minLat],
                  [minLng, maxLat],
                  [maxLng, maxLat],
                  [maxLng, minLat],
                  [minLng, minLat],
                ],
              ],
            },
            properties: {
              name: name,
            },
          };

          map.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            {
              padding: { top: 20, bottom: 20, left: 20, right: 20 }, // Optional padding
            }
          );

          // Add the GeoJSON feature to the map
          map.addSource(name, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [geoJsonFeature],
            },
          });

          // Add a layer with a red tint for the bounding box
          map.addLayer({
            id: name,
            type: "fill",
            source: name,
            layout: {},
            paint: {
              "fill-color": "#FFFFFF",
              "fill-opacity": 0.1,
            },
          });
        });

        // WMS layers
        // layers.forEach((layer, index) => {

        // let layer = layers[0];
        // const boundingBox = layer.EX_GeographicBoundingBox[0];
        // const extent = [
        //   parseFloat(boundingBox.westBoundLongitude[0]),
        //   parseFloat(boundingBox.southBoundLatitude[0]),
        //   parseFloat(boundingBox.eastBoundLongitude[0]),
        //   parseFloat(boundingBox.northBoundLatitude[0]),
        // ];
        // if (layer?.Name && layer?.Style) {
        //   // const layerId = `layer-${index}`;
        //   const layerName = layer?.Name[0];
        //   const styleName = layer?.Style[0]?.Name[0];
        //   const wmsUrl =
        //     "https://testtile.b3d.dk/cog/wms?BBOX={bbox-epsg-3857}&FORMAT=image/png&version=1.1.1&REQUEST=GetMap&SRS=EPSG:3857&TRANSPARENT=true&WIDTH=256&HEIGHT=256&LAYERS=https://testapi.b3d.dk/media/Uploads/RasterDataFinal/test.tif";
        //   // `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetMap&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256&layers=${layerName}&format=image/png&token=${token}&transparent=true`;
        //   AddRasterToMap({
        //     map: map,
        //     layerId: layerName,
        //     sourceId: `${layerName}-source`,
        //     source_layer: `${layerName}-source`,
        //     url: wmsUrl,
        //     extent,
        //     zoomToLayer: true,
        //     type: "raster",
        //     component: "AddPublicLayerForm",
        //   });
        // }
        // });
        // Fit map
        // const firstLayerBoundingBox = layers[0]?.EX_GeographicBoundingBox[0];
        // if (firstLayerBoundingBox) {
        //   const west = parseFloat(firstLayerBoundingBox.westBoundLongitude[0]);
        //   const east = parseFloat(firstLayerBoundingBox.eastBoundLongitude[0]);
        //   const south = parseFloat(firstLayerBoundingBox.southBoundLatitude[0]);
        //   const north = parseFloat(firstLayerBoundingBox.northBoundLatitude[0]);

        //   // <LatLonBoundingBox
        //   //   minx="11.261802122796457"
        //   //   miny="55.299341539834685"
        //   //   maxx="11.265041544826405"
        //   //   maxy="55.30095768426976"
        //   // />;

        //   map.fitBounds([
        //     11.261802122796457, 55.299341539834685, 11.265041544826405,
        //     55.30095768426976,
        //   ]);
        // }
      } catch (error) {
        console.error("Error adding layer:", error);
      }
    }
  };

  const fetchAndAddWFSLayer = async () => {
    const wfsUrl =
      "https://api.dataforsyningen.dk/wfs/MatGaeldendeOgForeloebigWFS_DAF?service=WFS&request=GetFeature&version=1.1.0&typename=mat:Ejerlejlighedslod_Foreloebig&outputFormat=application/json&srsName=EPSG:2583&NAMESPACE=xmlns(mat=http://data.gov.dk/schemas/matrikel/1)&token=061e2302db3bc927353b010889585017";

    try {
      const response = await fetch(wfsUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Log the content type and raw response
      const contentType = response.headers.get("Content-Type");
      // console.log("Content-Type:", contentType);

      const rawResponse = await response.text(); // Read the response as text
      // console.log("Raw response:", rawResponse); // Log the raw response for debugging

      let json;

      if (contentType.includes("application/json")) {
        // Parse JSON response
        json = JSON.parse(rawResponse);
      } else if (
        contentType.includes("application/xml") ||
        contentType.includes("text/xml")
      ) {
        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawResponse, "text/xml");

        const parseXML = (xml) => {
          return new Promise((resolve, reject) => {
            xml2js.parseString(
              new XMLSerializer().serializeToString(xml), // Convert XML document to string
              { mergeAttrs: true, explicitArray: false },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          });
        };

        json = await parseXML(xmlDoc);
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }

      console.log("Parsed JSON:", json); // Log the parsed JSON for debugging

      const extractFeatures = (json) => {
        // Ensure this matches the actual structure of your GeoJSON data
        const members = json["wfs:FeatureCollection"]?.["wfs:member"] || [];
        console.log(members);

        return members
          .map((member) => {
            const feature = member["mat:Ejerlejlighedslod_Foreloebig"];
            console.log(feature);

            // Check if geometry and posList exist
            const posList =
              feature?.["mat:geometri"]?.["gml:Polygon"]?.["gml:exterior"]?.[
                "gml:LinearRing"
              ]?.["gml:posList"]?._;

            if (!posList) {
              console.warn("Missing geometry or posList in feature:", feature);
              return null;
            }

            const coordinatePairs = posList.trim().split(" ");
            const coordinates = [];

            for (let i = 0; i < coordinatePairs.length; i += 2) {
              coordinates.push([
                parseFloat(coordinatePairs[i]),
                parseFloat(coordinatePairs[i + 1]),
              ]);
            }

            return {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [coordinates],
              },
              properties: {
                id: feature?.["gml:id"],
                lokalId: feature?.["mat:id.lokalId"],
                namespace: feature?.["mat:id.namespace"],
                ejerlejlighedLokalId: feature?.["mat:ejerlejlighedLokalId"],
                etagebetegnelse: feature?.["mat:etagebetegnelse"],
                forretningshaendelse: feature?.["mat:forretningshaendelse"],
                forretningsproces: feature?.["mat:forretningsproces"],
                lodAreal: feature?.["mat:lodAreal"]?._,
                uom: feature?.["mat:lodAreal"]?.uom,
                lodBeliggenhedstekst: feature?.["mat:lodBeliggenhedstekst"],
                lodLitra: feature?.["mat:lodLitra"],
                paataenktHandling: feature?.["mat:paataenktHandling"],
                registreringFra: feature?.["mat:registreringFra"],
                senesteSagLokalId: feature?.["mat:senesteSagLokalId"],
                virkningFra: feature?.["mat:virkningFra"],
                virkningsaktoer: feature?.["mat:virkningsaktoer"],
              },
            };
          })
          .filter((feature) => feature !== null);
      };

      const addFeaturesToMap = (map, features) => {
        map.addSource("wfs-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
        });

        map.addLayer({
          id: "wfs-layer",
          type: "fill",
          source: "wfs-data",
          layout: {},
          paint: {
            "fill-color": "#FF0000",
            "fill-opacity": 0.5,
          },
        });
      };

      const features = extractFeatures(json);
      addFeaturesToMap(map, features);

      console.log("layers added");

      // // Fit map to the bounds of the GeoJSON layer
      // const bounds = new MapLibreGL.LngLatBounds();
      // features.forEach((feature) => {
      //   feature.geometry.coordinates[0].forEach((coord) => {
      //     bounds.extend(coord);
      //   });
      // });
      // console.log(bounds);
      // map.fitBounds(bounds, { padding: 20 });
      // map.fitBounds([
      //   11.261802122796457, 55.299341539834685, 11.265041544826405,
      //   55.30095768426976,
      // ]);
    } catch (error) {
      console.error("Error fetching or adding WFS layer:", error);
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
              {features?.length > 0 ? (
                <Group className="mt-[1rem] flex fle">
                  {error ? (
                    <h1>{error.message}</h1>
                  ) : (
                    <h1>
                      <span className="font-semibold">
                        Total {form.getValues().name} layers :
                      </span>{" "}
                      {features?.length}
                    </h1>
                  )}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 "
                    onClick={fetchAndAddWFSLayer}
                  >
                    Add layers
                  </button>
                </Group>
              ) : (
                <div>No Layers Found</div>
              )}
            </div>
            // <div className="pb-[1rem]">
            //   {labels?.length > 0 ? (
            //     <Group className="mt-[1rem] flex fle">
            //       {error ? (
            //         <h1>{error.message}</h1>
            //       ) : (
            //         <h1>
            //           <span className="font-semibold">
            //             Total {form.getValues().name} layers :
            //           </span>{" "}
            //           {layers?.length}
            //         </h1>
            //       )}
            //       <button
            //         className="bg-blue-500 text-white px-2 py-1 "
            //         onClick={addLayers}
            //       >
            //         Add layers
            //       </button>
            //     </Group>
            //   ) : (
            //     <div>No Layers Found</div>
            //   )}
            // </div>
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
