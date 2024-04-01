import RemoveSourceAndLayerFromMap from "./RemoveSourceAndLayerFromMap";

const removeCheckedCategoriesLayersFromMap = (
  measuringcategories,
  client_id,
  map
) => {
  measuringcategories?.forEach((measuringcategory) => {
    measuringcategory?.sub_category?.forEach((sub_category) => {
      sub_category?.category?.forEach((cat) => {
        if (cat.checked && cat.type_of_geometry) {
          const sourceId = String(client_id) + cat.view_name + "source";
          const layerId = String(client_id) + cat.view_name + "layer";
          if (map) {
            RemoveSourceAndLayerFromMap({ map, sourceId, layerId });
          }
        }
      });
    });
  });
};

export default removeCheckedCategoriesLayersFromMap;
