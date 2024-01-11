import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import axios from "axios";
import { setshowMapLoader } from "../../reducers/MapView";
import { Map, LayerSpecification } from "maplibre-gl";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import {
  setCategoryId,
  setCategoryViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
} from "../../reducers/DrawnGeometry";

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
    (state) => state.mapView.clientDetail.client_id
  );
  const project_id = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );
  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );

  const category_id = useSelector((state) => state.drawnPolygon.category_id);
  const category_view_name = useSelector(
    (state) => state.drawnPolygon.category_view_name
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
  const handleEditCategory = (properties, feature_id) => {
    // First remove the poup content
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setCategoryId(properties.category_id));
    dispatch(setCategoryViewName(properties.view_name));
    dispatch(setMode("Edit"));
    dispatch(setFeatureId(feature_id));
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    const map = window.map_global;
    const draw = map.draw;
    draw.deleteAll();
    draw.add(features[0]);
    if (category_view_name) {
      const layerId = String(client_id) + category_view_name + "layer";
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
    map.on("draw.update", function (event) {
      const draw = map.draw;
      console.log(draw, "draw update");
      const feature = event.features;
      const geometry = feature[0].geometry;
      const type_of_geometry = feature[0].geometry.type;
      if (type_of_geometry === "Point") {
        const coordinates = geometry.coordinates;
        const wktCoordinates_final = `POINT (${coordinates[0]} ${coordinates[1]})`;
        console.log(wktCoordinates_final, "wkt point");
        dispatch(setWKTGeometry(wktCoordinates_final));
        dispatch(setTypeOfGeometry(type_of_geometry));
      }
      if (type_of_geometry === "Polygon") {
        const coordinates = geometry.coordinates[0];
        const wktCoordinates = coordinates
          .map((coord) => `${coord[0]} ${coord[1]}`)
          .join(", ");
        const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
        console.log(wktCoordinates_final, "wkt polygon ");
        dispatch(setWKTGeometry(wktCoordinates_final));
        dispatch(setTypeOfGeometry(type_of_geometry));
      }
      if (type_of_geometry === "LineString") {
        const coordinates = geometry.coordinates;
        const wktCoordinates = coordinates
          .map((coord) => `${coord[0]} ${coord[1]}`)
          .join(", ");
        const wktCoordinates_final = `LINESTRING (${wktCoordinates})`;
        console.log(wktCoordinates_final, "wkt line string");
        dispatch(setWKTGeometry(wktCoordinates_final));
        dispatch(setTypeOfGeometry(type_of_geometry));
      }
    });
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
