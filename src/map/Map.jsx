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
import { setCurrentMapExtent, setDisplayType } from "../reducers/MapView";
import { setWKTGeometry, setTypeOfGeometry } from "../reducers/DrawnGeometry";
import MeasureControl from "../components/DrawControl/MeasureControl";

export default function Map({ popUpRef }) {
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const { current_measuring_categories, current_tif, project_id } = useSelector(
    (state) => state.mapView.currentMapDetail
  );
  const currentMapExtent = useSelector(
    (state) => state.mapView.printDetails.currentMapExtent
  );

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [10.035153, 56.464267],
      zoom: 15,
      attributionControl: false,
    });

    window.map_global = map;
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      if (currentMapExtent) {
        map.fitBounds(currentMapExtent, { padding: 20 });
      }
      map.on("load", () => {
        const measuringcategories = current_measuring_categories;
        if (measuringcategories) {
          measuringcategories.forEach((measuringcategory) => {
            measuringcategory.sub_category.forEach((sub_category) => {
              sub_category.category.forEach((cat) => {
                if (cat.checked) {
                  if (cat.type_of_geometry) {
                    const sourceId =
                      String(client_id) + cat.view_name + "source";
                    const layerId = String(client_id) + cat.view_name + "layer";
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/category-style/?category=${cat.id}`
                      )
                      .then((response) => {
                        const categoryStyle = response.data[0];
                        let url = null;
                        let fillType = null;
                        if (cat.type_of_geometry === "Point") {
                          url = `${
                            import.meta.env.VITE_API_DASHBOARD_URL
                          }/category-point-geojson/?project=${project_id}&category=${
                            cat.id
                          }`;
                          fillType = "circle";
                        }
                        if (cat.type_of_geometry === "LineString") {
                          url = `${
                            import.meta.env.VITE_API_DASHBOARD_URL
                          }/category-linestring-geojson/?project=${project_id}&category=${
                            cat.id
                          }`;
                          fillType = "line";
                        }
                        if (cat.type_of_geometry === "Polygon") {
                          url = `${
                            import.meta.env.VITE_API_DASHBOARD_URL
                          }/category-polygon-geojson/?project=${project_id}&category=${
                            cat.id
                          }`;
                          fillType = "fill";
                        }
                        AddLayerAndSourceToMap({
                          map: map,
                          layerId: layerId,
                          sourceId: sourceId,
                          url: url,
                          source_layer: sourceId,
                          popUpRef: null,
                          showPopup: false,
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
                      });
                  }
                }
              });
            });
          });
        }

        if (current_tif) {
          const id = current_tif.id;
          axios
            .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
            .then((res) => {
              if (res.data.bounds) {
                // const bounds = res.data.bounds;
                // map.fitBounds(bounds);
                map.addSource(`${id}-source`, {
                  type: "raster",
                  tiles: [
                    `${
                      import.meta.env.VITE_API_RASTER_URL
                    }/tile-async/${id}/{z}/{x}/{y}.png`,
                  ],
                  tileSize: 512,
                });

                map.addLayer({
                  id: `${id}-layer`,
                  type: "raster",
                  source: `${id}-source`,
                  minzoom: 0,
                  maxzoom: 24,
                });
                map.moveLayer(`${id}-layer`, "Continent labels");
              }
            })
            .catch(() => {});
        }
      });
    }
  }, [
    map,
    dispatch,
    currentMapExtent,
    current_measuring_categories,
    client_id,
    project_id,
    current_tif,
  ]);

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
          console.log(map, "map when drawing");
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
        map.on("draw.update", function updateFunctionProject(event) {
          console.log("draw update event listner from map");
          // const draw = map.draw;
          console.log(draw, "draw update from layer control panel");
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
      // const popup_control = new PopupControl();
      // map.addControl(popup_control, "bottom-left");
    }
  }, [map, popUpRef]);

  return (
    <>
      <div
        // style={{ borderRadius: "8px", width: "820px", height: "834px" }}
        ref={mapContainer}
        id="map"
        className="map"
      >
        <Button
          onClick={() => {
            dispatch(setDisplayType("3D"));
            const map = window.map_global;
            const bounds = map.getBounds();
            dispatch(setCurrentMapExtent(bounds.toArray()));
          }}
          sx={{
            position: "absolute",
            top: "12px",
            right: "50px",
            zIndex: 99999,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "white",
            },
            color: "#D51B60",
          }}
        >
          3D
        </Button>
      </div>
    </>
  );
}

Map.propTypes = {
  popUpRef: PropTypes.object,
};
