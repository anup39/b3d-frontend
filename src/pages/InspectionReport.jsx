import React from "react";
import { Box } from "@mui/material";
import { Typography, Grid, Button } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import Appbar from "../components/Common/AppBar";
import { json, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function InspectionReport() {
  const { client_id, project_id, inspection_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapContainerReport = useRef(null);
  const [map, setMap] = React.useState(null);
  const [inspectionName, setInspectionName] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");

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

  const handleInspection = () => {
    navigate(
      `/projects/${client_id}/inspections/${project_id}/inspection/${inspection_id}`
    );
  };

  useEffect(() => {
    {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/inspection-report/${inspection_id}/`
        )
        .then((res) => {
          setInspectionName(res.data.name);
          setInspectionDate(res.data.date_of_inspection);
        });
    }
  }, [inspection_id]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-photo/?inspection_report=${inspection_id}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          res.data[0].selected = true;
        }
        res.data.forEach((image) => {
          const layerId = `point-${image.id}`;

          if (map && map.getLayer(layerId) === undefined) {
            map.addLayer({
              id: layerId,
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [image.longitude, image.latitude],
                  },
                },
              },
              paint: {
                "circle-radius": 10,
                "circle-color": image.selected ? "red" : "blue",
              },
            });
          }
          if (map && image.selected) {
            map.flyTo({
              center: [image.longitude, image.latitude],
              zoom: 22,
            });
          }
        });
      });
  }, [dispatch, inspection_id, map]);
  return (
    <>
      <Appbar />
      <Grid item>
        <Box sx={{ mt: 4, ml: 5, display: "flex", gap: 2 }}>
          <Button
            onClick={handleInspection}
            variant="contained"
            color="primary"
          >
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
                    {inspectionName ? inspectionName : "Inspection Name"}
                  </Typography>
                  <Typography sx={{ color: "#666666" }}>
                    Date :{" "}
                    {inspectionDate ? JSON.parse(inspectionDate) : "Date"}
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
