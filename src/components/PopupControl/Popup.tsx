import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import axios from "axios";
import { setshowMapLoader } from "../../reducers/MapView";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import { RootState } from "../../store";

declare global {
  interface Window {
    map_global: any;
  }
}

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
  features: any;
}

const Popup = ({ properties, feature_id, features }: PopupProps) => {
  const dispatch = useDispatch();
  // const state = useSelector((state) => state.drawnPolygon);
  const client_id = useSelector(
    (state: RootState) => state.mapView.clientDetail.client_id
  );
  const project_id = useSelector(
    (state: RootState) =>
      state.mapView.currentMapDetail.current_project_measuring_table
  );
  const current_measuring_categories = useSelector(
    (state: RootState) =>
      state.mapView.currentMapDetail.current_measuring_categories
  );

  const id = useSelector((state: RootState) => state.drawnPolygon.id);
  const view_name = useSelector(
    (state: RootState) => state.drawnPolygon.view_name
  );

  const propertyElements = properties
    ? Object.entries(properties).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))
    : null;

  const handleDeleteCategory = (properties, feature_id) => {
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
  const handleEditCategory = () => {
    // First remove the popup content
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    // Here now get the map object and then get the draw object and delete all the layers in draw and add the current features to the draw object
    const map = window.map_global;
    const draw = map.draw;
    draw.deleteAll();
    draw.add(features[0]);

    // Here setting the state of the draw object in drawPolygon
    console.log(properties, "properties");
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setMode("Edit"));
    dispatch(setFeatureId(feature_id));
    dispatch(setComponent(properties.component));
    dispatch(setViewName(properties.view_name));
    if (properties.component === "category") {
      dispatch(setId(properties.category_id));
    } else {
      dispatch(setId(properties.project_id));
    }

    //Note: Here i have to find if the clicked featue is of category or project
    if (view_name) {
      const layerId = String(client_id) + view_name + "layer";
      map.setFilter(layerId, null);
    }
    const layerId = String(client_id) + properties.view_name + "layer";
    map.setFilter(layerId, null);
    const layer = map.getLayer(layerId);
    const existingFilter = layer.filter || ["all"];
    const filterCondition = ["!=", ["id"], feature_id];
    const updatedFilter = ["all", existingFilter, filterCondition];
    map.setFilter(layerId, updatedFilter);
    // Loop through the elements and hide them
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
              onClick={() => handleEditCategory()}
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
