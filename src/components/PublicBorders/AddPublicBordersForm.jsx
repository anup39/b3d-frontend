import { Modal, Button, TextInput, Group } from "@mantine/core";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const token = localStorage.getItem("token");
// const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const targetUrl = `https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=${token}`;
// "http://87.62.99.220:5051/geoserver/b3d/gwc/service/wmts?service=WMTS&version=1.1.1&request=GetCapabilities";

const AddPublicBordersForm = () => {
  const [labels, setLabels] = useState([]);
  const [showLabels, setShowLabels] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "test",
      xmlUrl:
        "https://api.dataforsyningen.dk/wms/MatGaeldendeOgForeloebigWMS_DAF?service=WMS&request=GetCapabilities&token=",
    },
  });

  const handleSubmit = async (values) => {
    const { name, xmlUrl } = values;
    const token = localStorage.getItem("token");
    // adding token
    const withToken = xmlUrl + token;
    try {
      // Fetch the XML file
      const response = await fetch(withToken, {
        method: "get",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlText = await response.text();

      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const FeatureList = xmlDoc.getElementsByTagName("Layer");

      const itemsArray = [];

      Object.entries(FeatureList).forEach((item) => {
        const childNodes = item[1].childNodes;
        const childNodesObj = {};
        const title = item[1].getElementsByTagName("Name")[0].textContent;

        for (let i = 0; i < childNodes.length; i++) {
          const { localName, textContent } = childNodes[i];
          if (localName) {
            // childNodesObj.push({ [localName]: textContent });
            childNodesObj[localName] = textContent;
          }
        }
        itemsArray.push({ title, childNodesObj });
      });
      setLabels(itemsArray);
      setShowLabels(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const handleCloseForm = () => {
    form.reset();
    setLabels([]);
    setShowLabels(false);
    close();
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={handleCloseForm}
        title={"Add Public Borders"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={"30rem"}
        centered
      >
        <div className="max-h-[30rem] w-[27rem]">
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
                {/* {labels?.length > 0 ? "Post Layers" : "Get Layers"} */}
                Get Layers
              </Button>
            </div>
          </form>
          {showLabels && (
            <div className="pb-[1rem]">
              {labels?.length > 0 ? (
                <Group className="mt-[1rem]">
                  {error ? (
                    <h1>{error}</h1>
                  ) : (
                    <h1>
                      <span className="font-semibold">
                        Total {form.getValues().name} layers :
                      </span>{" "}
                      {labels?.length}
                    </h1>
                  )}
                  {labels.map((label, index) => {
                    return (
                      <li
                        className="text-[#444343] bg-[#d2cfcf] w-[100%] px-2 py-[1rem] list-none"
                        key={index}
                      >
                        <span>
                          <span className="font-semibold">Layer Name: </span>
                          {label?.childNodesObj?.Name}
                        </span>
                        <span className="block">
                          <span className="font-semibold">
                            EX_GeographicBoundingBox:
                          </span>
                          {label?.childNodesObj?.EX_GeographicBoundingBox}
                        </span>
                      </li>
                    );
                  })}
                </Group>
              ) : (
                <div>No Layers Found</div>
              )}
            </div>
          )}
        </div>
      </Modal>
      <Button bg="#1976d2" px="5px" h="1.6rem" onClick={open}>
        ADD PUBLIC BORDERS
      </Button>
    </div>
  );
};

export default AddPublicBordersForm;
