import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.scss";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import PropTypes from "prop-types";
import LayersControl from "../components/LayerControl/LayerControl";
import DrawControl from "../components/DrawControl/DrawControl";
import RasterControl from "../components/RasterControl/RasterControl";
// import PopupControl from "../components/PopupControl/PopupControl";
import TableMeasuringsForMapControl from "../components/TableMeasuringMapControl/TableMeasuringsMapControl";
import PieChartControl from "../components/PieChartControl/PieChartControl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import AddLayerAndSourceToMap from "../maputils/AddLayerAndSourceToMap";
import { Button } from "@mui/material";
import {
  setCurrentMapExtent,
  setDisplayType,
  setIndoorsInMap,
  setShowIndoorControl,
  setShowThreeDFrame,
  setCurrentThreeD,
} from "../reducers/MapView";
import { setWKTGeometry, setTypeOfGeometry } from "../reducers/DrawnGeometry";
import MeasureControl from "../components/DrawControl/MeasureControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { setShowKeyInfo } from "../reducers/DrawnGeometry";
import MeasuringUploadStatusControl from "../components/MeasuringUploadStatusControl/MeasuringUploadStatusControl";
import IndoorControl from "../components/IndoorControl/IndoorControl";
import { fetchIndoorsByProjectId } from "../api/api";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";

export default function Map({ popUpRef }) {
  console.log("Map component");
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const { current_tif } = useSelector(
    (state) => state.mapView.currentMapDetail
  );
  const current_measuring_categories = useSelector(
    (state) => state.client.current_measuring_categories
  );

  const project_id = useSelector((state) => state.project.project_id);

  const currentMapExtent = useSelector(
    (state) => state.mapView.printDetails.currentMapExtent
  );
  const show_key_info = useSelector(
    (state) => state.drawnPolygon.show_key_info
  );

  const showIndoorControl = useSelector(
    (state) => state.mapView.showIndoorControl
  );

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      // center: [10.035153, 56.464267],
      center: [11.326301469413806, 55.39925417342158],
      zoom: 16,
      attributionControl: false,
    });

    window.map_global = map;
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  // useEffect(() => {
  //   if (map) {
  //     if (currentMapExtent) {
  //       map.fitBounds(currentMapExtent, { padding: 20 });
  //     }
  //     map.on("load", () => {
  //       console.log("map loaded from map componenet ");
  //       const measuringcategories = current_measuring_categories;
  //       if (measuringcategories) {
  //         console.log(measuringcategories, "measuring categories");
  //         measuringcategories.forEach((measuringcategory) => {
  //           measuringcategory.sub_category.forEach((sub_category) => {
  //             sub_category.category.forEach((cat) => {
  //               if (cat.checked) {
  //                 if (cat.type_of_geometry) {
  //                   const sourceId =
  //                     String(client_id) + cat.view_name + "source";
  //                   const layerId = String(client_id) + cat.view_name + "layer";
  //                   axios
  //                     .get(
  //                       `${
  //                         import.meta.env.VITE_API_DASHBOARD_URL
  //                       }/category-style/?category=${cat.id}`
  //                     )
  //                     .then((response) => {
  //                       const categoryStyle = response.data[0];
  //                       let url = null;
  //                       let fillType = null;
  //                       if (cat.type_of_geometry === "Point") {
  //                         url = `${
  //                           import.meta.env.VITE_API_DASHBOARD_URL
  //                         }/category-point-geojson/?project=${project_id}&category=${
  //                           cat.id
  //                         }`;
  //                         fillType = "circle";
  //                       }
  //                       if (cat.type_of_geometry === "LineString") {
  //                         url = `${
  //                           import.meta.env.VITE_API_DASHBOARD_URL
  //                         }/category-linestring-geojson/?project=${project_id}&category=${
  //                           cat.id
  //                         }`;
  //                         fillType = "line";
  //                       }
  //                       if (cat.type_of_geometry === "Polygon") {
  //                         url = `${
  //                           import.meta.env.VITE_API_DASHBOARD_URL
  //                         }/category-polygon-geojson/?project=${project_id}&category=${
  //                           cat.id
  //                         }`;
  //                         fillType = "fill";
  //                       }
  //                       AddLayerAndSourceToMap({
  //                         map: map,
  //                         layerId: layerId,
  //                         sourceId: sourceId,
  //                         url: url,
  //                         source_layer: sourceId,
  //                         popUpRef: null,
  //                         showPopup: false,
  //                         style: {
  //                           fill_color: categoryStyle.fill,
  //                           fill_opacity: categoryStyle.fill_opacity,
  //                           stroke_color: categoryStyle.stroke,
  //                         },
  //                         zoomToLayer: false,
  //                         extent: [],
  //                         geomType: "geojson",
  //                         fillType: fillType,
  //                         trace: false,
  //                         component: "map",
  //                       });
  //                     });
  //                 }
  //               }
  //             });
  //           });
  //         });
  //       }

  //       if (current_tif) {
  //         const id = current_tif.id;
  //         axios
  //           .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
  //           .then((res) => {
  //             if (res.data.bounds) {
  //               // const bounds = res.data.bounds;
  //               // map.fitBounds(bounds);
  //               map.addSource(`${id}-source`, {
  //                 type: "raster",
  //                 tiles: [
  //                   `${
  //                     import.meta.env.VITE_API_RASTER_URL
  //                   }/tile-async/${id}/{z}/{x}/{y}.png`,
  //                 ],
  //                 tileSize: 512,
  //               });

  //               map.addLayer({
  //                 id: `${id}-layer`,
  //                 type: "raster",
  //                 source: `${id}-source`,
  //                 minzoom: 0,
  //                 maxzoom: 24,
  //               });
  //               map.moveLayer(`${id}-layer`, "Continent labels");
  //             }
  //           })
  //           .catch(() => {});
  //       }
  //     });
  //   }
  // }, [
  //   map,
  //   dispatch,
  //   currentMapExtent,
  //   current_measuring_categories,
  //   client_id,
  //   project_id,
  //   current_tif,
  // ]);

  // useEffect(() => {
  //   if (map) {
  //     const geocoder = new MaplibreGeocoder(GeocoderApi, {
  //       maplibregl: maplibregl,
  //       showResultsWhileTyping: true,
  //       flyTo: true,
  //     });

  //     geocoder.addTo(refObj.current);
  //     geocoder.on("result", function (ev) {
  //       const coords = ev.result.geometry.coordinates;
  //       map.flyTo({ center: coords });
  //     });
  //   }
  // }, [map, refObj]);

  useEffect(() => {
    if (map) {
      map.on("load", () => {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });
        // 1 Draw and its layer
        map.addControl(draw);
        map.draw = draw;
        map.on("draw.create", function (event) {
          dispatch(setShowKeyInfo(true));
          const feature = event.features;
          const geometry = feature[0].geometry;
          const type_of_geometry = feature[0].geometry.type;
          if (type_of_geometry === "Point") {
            const coordinates = geometry.coordinates;
            const wktCoordinates_final = `POINT (${coordinates[0]} ${coordinates[1]})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "Polygon") {
            const coordinates = geometry.coordinates[0];
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "LineString") {
            const coordinates = geometry.coordinates;
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `LINESTRING (${wktCoordinates})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
        });
        map.on("draw.update", function updateFunctionProject(event) {
          dispatch(setShowKeyInfo(true));
          // const draw = map.draw;
          const feature = event.features;
          const geometry = feature[0].geometry;
          const type_of_geometry = feature[0].geometry.type;
          if (type_of_geometry === "Point") {
            const coordinates = geometry.coordinates;
            const wktCoordinates_final = `POINT (${coordinates[0]} ${coordinates[1]})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "Polygon") {
            const coordinates = geometry.coordinates[0];
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "LineString") {
            const coordinates = geometry.coordinates;
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `LINESTRING (${wktCoordinates})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
        });
      });
    }
  }, [map, dispatch]);

  useEffect(() => {
    if (map) {
      const layer_control = new LayersControl();
      map.addControl(layer_control, "top-left");
      layer_control.updateProject(popUpRef);
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      const raster_control = new RasterControl();
      map.addControl(raster_control, "top-left");
      const table_measurings_control = new TableMeasuringsForMapControl();
      map.addControl(table_measurings_control, "bottom-right");
      const piechart_control = new PieChartControl();
      map.addControl(piechart_control, "bottom-left");
      raster_control.updateProject();
      const draw_control = new DrawControl();
      map.addControl(draw_control, "top-right");
      draw_control.updateDrawControl(popUpRef);
      const measure_control = new MeasureControl();
      map.addControl(measure_control, "top-right");
      measure_control.updateMeasureControl(popUpRef);
      map.addControl(new maplibregl.ScaleControl(), "bottom-left");
      const measuring_upload_status_control =
        new MeasuringUploadStatusControl();
      map.addControl(measuring_upload_status_control, "top-right");
      // const popup_control = new PopupControl();
      // map.addControl(popup_control, "bottom-left");
    }
  }, [map, popUpRef]);

  const handle3D = () => {
    if (project_id && project_id !== "All") {
      axios
        .get(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/projects/${project_id}/`
        )
        .then((res) => {
          const project = res.data;
          const url = project.url;
          // if (url) {
          //   window.open(url, "_blank");
          // }
          dispatch(setCurrentThreeD(project));
          dispatch(setShowThreeDFrame(true));
        });
    }
  };

  const handleIndoor = () => {
    dispatch(setShowIndoorControl(true));
    fetchIndoorsByProjectId(project_id).then((res) => {
      dispatch(setIndoorsInMap(res));
    });
  };

  return (
    <>
      <div ref={mapContainer} id="map" className="map">
        <LanguageSwitcher
          position={"absolute"}
          top={"4px"}
          right={"42px"}
          zIndex={9999}
          margin={1}
          padding={0}
          backgroundColor={"white"}
          borderRadius={"5px"}
        />
        {project_id && project_id !== "All" ? (
          <>
            <Button
              onClick={handle3D}
              sx={{
                position: "absolute",
                top: "12px",
                right: "125px",
                zIndex: 9999,
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                color: "#D51B60",
              }}
            >
              3D
            </Button>

            <Button
              onClick={handleIndoor}
              sx={{
                position: "absolute",
                top: "12px",
                right: "200px",
                zIndex: 9999,
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                color: "#D51B60",
              }}
            >
              Indoor{" "}
            </Button>
            {showIndoorControl ? <IndoorControl /> : null}
          </>
        ) : null}

        {show_key_info ? (
          <Card
            sx={{
              position: "absolute",
              top: "12px",
              right: "41%",
              zIndex: 99999,
            }}
          >
            <Typography sx={{ m: 1 }} variant="body2" component="p">
              Press
              <span style={{ color: "#D51B60" }}> Enter </span> to Save drawing
              and
              <span style={{ color: "#D51B60" }}> Esc </span>
              to cancel
            </Typography>
          </Card>
        ) : null}
      </div>
    </>
  );
}

Map.propTypes = {
  popUpRef: PropTypes.object,
};
