import React from "react";
import { Box } from "@mui/material";
import { Typography, Grid, Button } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import TableMeasuringsForMap from "../TableMeasuringMapControl/TableMesuringsForMap";
import "./ReportPrint.css";
import { useDispatch } from "react-redux";
import {
  setshowReport,
  setshowMap,
  setshowPiechart,
  setshowTableMeasurings,
  setshowSidebarContent,
} from "../../reducers/MapView";
import PieChartComp from "../PieChartControl/PieChartComp";
import { useSelector } from "react-redux";
import axios from "axios";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import MapSection from "./MapSection";

export default function ReportPrint({ popUpRef }) {
  const dispatch = useDispatch();
  const mapContainerReport = useRef(null);
  const [map, setMap] = React.useState(null);

  const currentClient = useSelector(
    (state) => state.client.clientDetail.client_id
  );
  const currentProject = useSelector((state) => state.project.project_id);
  const current_measuring_categories = useSelector(
    (state) => state.client.current_measuring_categories
  );
  const current_tif = useSelector(
    (state) => state.mapView.currentMapDetail.current_tif
  );
  const currentMapExtent = useSelector(
    (state) => state.mapView.printDetails.currentMapExtent
  );

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

  // useEffect(() => {
  //   if (map && currentMapExtent) {
  //     console.log(currentMapExtent);
  //     map.on("load", () => {
  //       map.fitBounds(currentMapExtent);
  //     });

  //     const measuringcategories = current_measuring_categories;
  //     measuringcategories?.forEach((measuringcategory) => {
  //       measuringcategory.sub_category.forEach((sub_category) => {
  //         sub_category.category.forEach((cat) => {
  //           if (cat.checked) {
  //             if (cat.type_of_geometry) {
  //               const sourceId =
  //                 String(currentClient) + cat.view_name + "source";
  //               const layerId = String(currentClient) + cat.view_name + "layer";
  //               axios
  //                 .get(
  //                   `${
  //                     import.meta.env.VITE_API_DASHBOARD_URL
  //                   }/category-style/?category=${cat.id}`
  //                 )
  //                 .then((response) => {
  //                   const categoryStyle = response.data[0];
  //                   let url = null;
  //                   let fillType = null;
  //                   if (cat.type_of_geometry === "Point") {
  //                     url = `${
  //                       import.meta.env.VITE_API_DASHBOARD_URL
  //                     }/category-point-geojson/?project=${currentProject}&category=${
  //                       cat.id
  //                     }`;
  //                     fillType = "circle";
  //                   }
  //                   if (cat.type_of_geometry === "LineString") {
  //                     url = `${
  //                       import.meta.env.VITE_API_DASHBOARD_URL
  //                     }/category-linestring-geojson/?project=${currentProject}&category=${
  //                       cat.id
  //                     }`;
  //                     fillType = "line";
  //                   }
  //                   if (cat.type_of_geometry === "Polygon") {
  //                     url = `${
  //                       import.meta.env.VITE_API_DASHBOARD_URL
  //                     }/category-polygon-geojson/?project=${currentProject}&category=${
  //                       cat.id
  //                     }`;
  //                     fillType = "fill";
  //                   }
  //                   AddLayerAndSourceToMap({
  //                     map: map,
  //                     layerId: layerId,
  //                     sourceId: sourceId,
  //                     url: url,
  //                     source_layer: sourceId,
  //                     popUpRef: null,
  //                     showPopup: false,
  //                     style: {
  //                       fill_color: categoryStyle.fill,
  //                       fill_opacity: categoryStyle.fill_opacity,
  //                       stroke_color: categoryStyle.stroke,
  //                     },
  //                     zoomToLayer: false,
  //                     extent: [],
  //                     geomType: "geojson",
  //                     fillType: fillType,
  //                     trace: false,
  //                     component: "map",
  //                   });
  //                 });
  //             }
  //           }
  //         });
  //       });
  //     });

  //     if (current_tif) {
  //       console.log("In reprot");
  //       const id = current_tif.id;
  //       axios
  //         .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
  //         .then((res) => {
  //           if (res.data.bounds) {
  //             map.addSource(`${id}-source`, {
  //               type: "raster",
  //               tiles: [
  //                 `${
  //                   import.meta.env.VITE_API_RASTER_URL
  //                 }/tile-async/${id}/{z}/{x}/{y}.png`,
  //               ],
  //               tileSize: 512,
  //             });

  //             map.addLayer({
  //               id: `${id}-layer`,
  //               type: "raster",
  //               source: `${id}-source`,
  //               minzoom: 0,
  //               maxzoom: 24,
  //             });
  //           }
  //         })
  //         .catch(() => {});
  //     }
  //   }
  // }, [
  //   currentMapExtent,
  //   map,
  //   currentClient,
  //   currentProject,
  //   current_measuring_categories,
  //   current_tif,
  // ]);

  const handlePrint = () => {
    window.print();
  };

  const handleMap = () => {
    // dispatch(setshowPiechart(false));
    // dispatch(setshowTableMeasurings(false));
    // dispatch(setshowMap(true));
    dispatch(setshowReport(false));
    dispatch(setshowSidebarContent(true));
  };

  return (
    <div className="report_print">
      <Grid>
        <Grid item>
          <Box>
            <div className="main_section">
              <div className="report_buttons">
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box>
                    <Button
                      onClick={handlePrint}
                      variant="contained"
                      sx={{ backgroundColor: "#E91E62", color: "white" }}
                    >
                      Print
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      onClick={handleMap}
                      variant="contained"
                      sx={{ backgroundColor: "#E91E62", color: "white" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </div>

              <div className="report_main">
                <div style={{ display: "flex" }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: "#666666" }}>
                      Measurings for Map nov
                    </Typography>
                    <Typography sx={{ color: "#666666" }}>
                      Date : 2023-01-45
                    </Typography>
                  </Box>
                </div>
                {/* <Box> */}
                {/* <div ref={mapContainerReport} className="page_map"></div> */}
                <MapSection popUpRef={popUpRef} />
                {/* </Box> */}

                <Box sx={{ ml: "0%" }}>
                  <PieChartComp showCloseButton={false} />
                </Box>
                <Box sx={{ mt: 5 }}>
                  <TableMeasuringsForMap
                    width={700}
                    showCloseButton={false}
                    marginLeftOfTitle={"0%"}
                    // className="tablemeasurings"
                  />
                </Box>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
