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

export default function Map({ id }) {
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const popUpRef = useRef(new maplibregl.Popup({ closeOnClick: false }));

  const currentMapExtent = useSelector(
    (state) => state.mapView.printDetails.currentMapExtent
  );
  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );
  const current_tif = useSelector(
    (state) => state.mapView.currentMapDetail.current_tif
  );
  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const currentProject = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
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
                      String(currentClient) + cat.view_name + "source";
                    const layerId =
                      String(currentClient) + cat.view_name + "layer";
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
                          }/category-point-geojson/?project=${currentProject}&category=${
                            cat.id
                          }`;
                          fillType = "circle";
                        }
                        if (cat.type_of_geometry === "LineString") {
                          url = `${
                            import.meta.env.VITE_API_DASHBOARD_URL
                          }/category-linestring-geojson/?project=${currentProject}&category=${
                            cat.id
                          }`;
                          fillType = "line";
                        }
                        if (cat.type_of_geometry === "Polygon") {
                          url = `${
                            import.meta.env.VITE_API_DASHBOARD_URL
                          }/category-polygon-geojson/?project=${currentProject}&category=${
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
                map.moveLayer(
                  `${id}-layer`,
                  "gl-draw-polygon-fill-inactive.cold"
                );
              }
            })
            .catch(() => {});
        }

        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });

        // 1 Draw and its layer
        map.addControl(draw);
        map.draw = draw;
      });
    }
  }, [
    map,
    dispatch,
    currentMapExtent,
    current_measuring_categories,
    currentClient,
    currentProject,
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
      const layer_control = new LayersControl();
      map.addControl(layer_control, "top-left");
      layer_control.updateProject(id, popUpRef);
      // map.addControl(
      //   new MaplibreExportControl({
      //     PageSize: Size.A3,
      //     PageOrientation: PageOrientation.Portrait,
      //     Format: Format.PNG,
      //     DPI: DPI[96],
      //     Crosshair: true,
      //     PrintableArea: true,
      //   }),
      //   "top-right"
      // );

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      const raster_control = new RasterControl();
      map.addControl(raster_control, "top-left");
      const table_measurings_control = new TableMeasuringsForMapControl();
      map.addControl(table_measurings_control, "bottom-right");
      const piechart_control = new PieChartControl();
      map.addControl(piechart_control, "bottom-left");
      raster_control.updateProject(id);
      map.addControl(new DrawControl(), "top-right");

      // const popup_control = new PopupControl();
      // map.addControl(popup_control, "bottom-left");
    }
  }, [map, id]);

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
  refObj: PropTypes.object,
  id: PropTypes.string,
};
