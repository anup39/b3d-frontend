import React from "react";
import { Box } from "@mui/material";
import { Typography, Grid, Button } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import Appbar from "../components/Common/AppBar";

export default function InspectionReport() {
  const dispatch = useDispatch();
  const mapContainerReport = useRef(null);
  const [map, setMap] = React.useState(null);

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

  const handlePrint = () => {
    window.print();
  };

  const handleMap = () => {};
  return (
    <>
      <Appbar />
      <Grid item>
        <Box sx={{ mt: 4, ml: 5, display: "flex", gap: 2 }}>
          <Button onClick={handleMap} variant="contained" color="primary">
            Inspection
          </Button>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
        </Box>
      </Grid>

      <Grid
        container
        justifyContent="center"
        // alignItems="center"
        style={{ minHeight: "100vh" }}
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
                ></div>
              </Box>

              <Box sx={{ mt: 5 }}>{/* Add images here  */}</Box>
              <Box sx={{ ml: "40%" }}>{/* Add more detail here  */}</Box>
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
