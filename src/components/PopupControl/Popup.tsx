import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import axios from "axios";
import { setshowMapLoader } from "../../reducers/MapView";
import { Map, LayerSpecification } from "maplibre-gl";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";

interface PopupProps {
  properties: {
    [key: string]: string | number;
    id: number;
    mill_name: string;
    mill_eq_id: string;
    mill_long: string;
    mill_lat: string;
  };
  feature_id: number;
}

const Popup = ({ properties, feature_id }: PopupProps) => {
  const dispatch = useDispatch();
  // const state = useSelector((state) => state.drawnPolygon);
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const project_id = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );
  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );

  const category_id = useSelector((state) => state.drawnPolygon.category_id);
  const propertyElements = properties
    ? Object.entries(properties).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))
    : null;

  const handleDeleteCategory = (properties, feature_id) => {
    console.log(properties, feature_id);
    dispatch(setshowMapLoader(true));
    if (properties.type_of_geometry === "Polygon") {
      axios
        .delete(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/polygon-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            console.log(map, "map");
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-polygon-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    } else if (properties.type_of_geometry === "LineString") {
      axios
        .delete(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/linestring-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            console.log(map, "map");
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-linestring-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    } else {
      axios
        .delete(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/point-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            console.log(map, "map");
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-point-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    }
  };
  const handleEditCategory = (properties, feature_id) => {
    // console.log(properties, feature_id);
    const map = window.map_global;
    // map.on("click", (e) => {
    //   console.log(e);
    // });
    const feature = {
      id: 65,
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.85288198135186, 2.323813462091607],
            [103.86962550867833, 2.283847366844142],
            [103.93101844221007, 2.29593025797314],
            [103.89846158351799, 2.325672322860825],
            [103.90125217140604, 2.342401959330829],
            [103.85288198135186, 2.323813462091607],
          ],
        ],
      },
      properties: {},
    };
    map.draw.add(feature);
    const popups = document.getElementsByClassName("maplibregl-popup");

    if (popups.length) {
      popups[0].remove();
    }
    const sourceId = String(client_id) + properties.view_name + "source";
    const layerId = String(client_id) + properties.view_name + "layer";
    console.log(sourceId);
    // RemoveSourceAndLayerFromMap({ map, layerId, sourceId });
    console.log(current_measuring_categories);
    console.log(properties.category_id);
    const popupContent = document.getElementById("popup-custom");

    // Loop through the elements and hide them

    // popupContent.style.display = "none";
    const layer = map.getLayer(layerId);
    const filterCondition = ["!=", ["id"], 65];
    const existingFilter = layer.filter || ["all"];

    // Update the filter with the new condition
    const updatedFilter = ["all", existingFilter, filterCondition];
    // Apply the updated filter to the layer
    map.setFilter(layerId, updatedFilter);
    console.log(layer);
    // Loop through the elements and hide them

    // dispatch(set)
    // console.log(featureIds);
    // map.draw.changeMode("draw_polygon");
    // map.draw.add(
    //   "http://137.135.165.161:8000/api/category-polygon-geojson/?project=14&category=25"
    // );
    // map.draw.changeMode("draw_polygon");
  };
  return (
    <>
      {properties ? (
        <div>
          <div>{propertyElements}</div>
          <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleDeleteCategory(properties, feature_id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",

                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleEditCategory(properties, feature_id)}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Popup;
