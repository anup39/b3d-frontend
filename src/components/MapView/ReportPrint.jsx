import React from "react";
import Appbar from "../Common/AppBar";
import { Box } from "@mui/material";
import { Typography, Grid, Button } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import TableMeasurings from "./TableMeasurings";
import TableMeasuringsForMap from "../TableMeasuringMapControl/TableMesuringsForMap";
import "./ReportPrint.css";
import { useDispatch } from "react-redux";
import {
  setshowReport,
  setshowMap,
  setshowPiechart,
  setshowTableMeasurings,
  setCurrentMapExtent,
} from "../../reducers/MapView";
import PieChartComp from "../PieChartControl/PieChartComp";
import { useSelector } from "react-redux";
import Map from "../../map/Map";
import axios from "axios";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";

export default function ReportPrint() {
  const dispatch = useDispatch();
  const mapContainerReport = useRef(null);
  const [map, setMap] = React.useState(null);

  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const currentProject = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );
  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );
  const current_tif = useSelector(
    (state) => state.mapView.currentMapDetail.current_tif
  );
  const currentMapExtent = useSelector(
    (state) => state.mapView.printDetails.currentMapExtent
  );

  console.log(current_measuring_categories, "current measuring cateogries");
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerReport.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [103.8574, 2.2739],
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    window.map_report = map;

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    // console.log(currentMapExtent);
    if (map && currentMapExtent) {
      console.log(currentMapExtent);
      map.on("load", () => {
        map.fitBounds(currentMapExtent);
      });

      const measuringcategories = current_measuring_categories;
      measuringcategories?.forEach((measuringcategory) => {
        measuringcategory.sub_category.forEach((sub_category) => {
          sub_category.category.forEach((cat) => {
            if (cat.checked) {
              if (cat.type_of_geometry) {
                const sourceId =
                  String(currentClient) + cat.view_name + "source";
                const layerId = String(currentClient) + cat.view_name + "layer";
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

      if (current_tif) {
        const id = current_tif.id;
        axios
          .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
          .then((res) => {
            if (res.data.bounds) {
              const bounds = res.data.bounds;
              map.fitBounds(bounds);
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
              // map.moveLayer(`${id}-layer`);
              // dispatch(addSelectedTifId(tif_id));
            }
          })
          .catch(() => {});
      }
    }
  }, [
    currentMapExtent,
    map,
    currentClient,
    currentProject,
    current_measuring_categories,
    current_tif,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleMap = () => {
    dispatch(setshowPiechart(false));
    dispatch(setshowTableMeasurings(false));
    dispatch(setshowMap(true));
    dispatch(setshowReport(false));
  };
  return (
    <>
      {/* <Appbar /> */}
      <Grid item>
        <Box sx={{ ml: "10%", mt: 3 }}>
          <Button onClick={handleMap} variant="contained" color="primary">
            Map
          </Button>
        </Box>
      </Grid>
      <Grid item>
        <Box sx={{ ml: "30%", mt: 3 }}>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
        </Box>
      </Grid>

      <Grid
        container
        justifyContent="center"
        // alignItems="center"
        style={{ minHeight: "100vh" }} // Set the height of the container to fill the viewport
      >
        <Grid item>
          <Box>
            <div className="print-only">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 5,
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#666666" }}>
                    Measurings for Map nov
                  </Typography>
                  <Typography sx={{ color: "#666666" }}>
                    Date : 2023-01-45
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AdbIcon sx={{ mr: 1 }} />
                  <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "#027FFE",
                      textDecoration: "none",
                    }}
                  >
                    B3D
                  </Typography>
                </Box>
              </Box>
              <Box>
                <div
                  style={{
                    borderRadius: "8px",
                    width: "820px",
                    height: "834px",
                  }}
                  ref={mapContainerReport}
                  id="map"
                  className="map"
                >
                  {/* <Map id={String(currentProject)}></Map> */}
                </div>
              </Box>

              <Box sx={{ mt: 5 }}>
                <TableMeasuringsForMap width={820} />
              </Box>
              <Box sx={{ ml: "40%" }}>
                <PieChartComp />
              </Box>

              <Box sx={{ mt: 10 }}>{/* <TableMeasurings /> */}</Box>
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
