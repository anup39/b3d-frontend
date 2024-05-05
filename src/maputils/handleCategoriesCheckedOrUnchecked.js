import RemoveSourceAndLayerFromMap from "./RemoveSourceAndLayerFromMap";
import axios from "axios";
import AddLayerAndSourceToMap from "./AddLayerAndSourceToMap";

// Here the editting part is done in the most of the section in the current development:

const handleCategoriesChange = async (
  event,
  cat,
  client_id,
  project_id,
  map,
  popUpRef
) => {
  console.log(cat, "cat");
  const sourceId = String(client_id) + cat.view_name + "source";
  const layerId = String(client_id) + cat.view_name + "layer";

  if (event.target.checked) {
    if (cat.type_of_geometry) {
      RemoveSourceAndLayerFromMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
      });

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/global-category-style/?category=${cat.global_category}`
      );

      const categoryStyle = response.data[0];
      let url = null;
      let fillType = null;
      if (cat.type_of_geometry === "Point") {
        url = `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/category-point-geojson/?client=${client_id}&project=${
          project_id === "All" ? "" : project_id
        }&category=${cat.id}`;
        fillType = "circle";
      }
      if (cat.type_of_geometry === "LineString") {
        url = `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/category-linestring-geojson/?client=${client_id}&project=${
          project_id === "All" ? "" : project_id
        }&category=${cat.id}`;
        fillType = "line";
      }
      if (cat.type_of_geometry === "Polygon") {
        url = `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/category-polygon-geojson/?client=${client_id}&project=${
          project_id === "All" ? "" : project_id
        }&category=${cat.id}`;
        fillType = "fill";
      }
      AddLayerAndSourceToMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
        url: url,
        source_layer: sourceId,
        popUpRef: popUpRef,
        showPopup: true,
        style: {
          fill_color: categoryStyle.fill,
          fill_opacity: categoryStyle.fill_opacity,
          stroke_color: categoryStyle.stroke,
        },
        zoomToLayer: false,
        extent: [],
        geomType: "geojson",
        fillType: fillType,
        trace: false,
        component: "map",
      });
    }
  } else {
    RemoveSourceAndLayerFromMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
    });
  }
};

export default handleCategoriesChange;
