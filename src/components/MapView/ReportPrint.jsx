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

  useEffect(() => {
    // console.log(currentMapExtent);
    if (map && currentMapExtent) {
      console.log(currentMapExtent);
      map.on("load", () => {
        map.fitBounds(currentMapExtent);
      });
    }
  }, [currentMapExtent, map]);

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
