import React from "react";
import Appbar from "../Common/AppBar";
import { Box } from "@mui/material";
import { Typography, Grid } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";

export default function ReportPrint() {
  const mapContainerReport = useRef(null);

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
    // setMap(map);

    return () => {
      map.remove();
    };
  }, []);
  return (
    <>
      <Appbar />
      <Grid
        container
        justifyContent="center"
        // alignItems="center"
        style={{ minHeight: "100vh" }} // Set the height of the container to fill the viewport
      >
        <Grid item>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 5,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography>Measurings for Property A</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
                style={{ width: "820px", height: "834px" }}
                ref={mapContainerReport}
                id="map"
                className="map"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
