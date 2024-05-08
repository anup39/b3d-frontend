import React from "react";
import { Box } from "@mui/material";
import { Typography, Grid, Button } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import TableMeasuringsForMap from "../TableMeasuringMapControl/TableMesuringsForMap";
import "./ReportPrint.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setshowPiechart,
  setshowReport,
  setshowSidebarContent,
  setshowTableMeasurings,
} from "../../reducers/MapView";
import PieChartComp from "../PieChartControl/PieChartComp";
import { useTranslation } from "react-i18next";

export default function ReportPrint() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapContainerReport = useRef(null);
  const [map, setMap] = React.useState(null);
  const [paperSize, setPaperSize] = useState("A4");

  const handleChange = (event) => {
    setPaperSize(event.target.value);
  };

  const current_project_name = useSelector(
    (state) => state.project.current_project_name
  );

  const getWidth = () => {
    switch (paperSize) {
      case "A4":
        return "21cm";
      case "A3":
        return "29.7cm";
      case "A2":
        return "42cm";
      case "A1":
        return "59.4cm";
      default:
        return "21cm"; // Default to A4
    }
  };

  const getHeight = () => {
    switch (paperSize) {
      case "A4":
        return `${29.7 / 2}cm`;
      case "A3":
        return `${42 / 2}cm`;
      case "A2":
        return `${59.4 / 2}cm`;
      case "A1":
        return `${84.1 / 2}cm`;
      default:
        return `${29.7 / 2}`; // Default to A4
    }
  };

  useEffect(() => {
    const setPageSize = (width, height) => {
      // Remove the old style element if it exists
      const oldStyle = document.getElementById("dynamicPageSize");
      if (oldStyle) oldStyle.remove();

      // Create a new style element
      const style = document.createElement("style");
      style.id = "dynamicPageSize";

      // Set the content of the style element
      style.textContent = `
        @media print {
          @page {
            size: ${width}cm ${height}cm;
            margin: 0;
          }
          .report_buttons{
            display: none;
           }
          .report_print{
            box-shadow: none;

          }
        }
      `;

      // Insert the style element into the document
      document.head.appendChild(style);
    };

    // Set the page size based on the paperSize state
    switch (paperSize) {
      case "A5":
        setPageSize(14.8, 21.0);
        break;
      case "A4":
        setPageSize(21.0, 29.7);
        break;
      case "A3":
        setPageSize(29.7, 42.0);
        break;
      case "A2":
        setPageSize(42.0, 59.4);
        break;
      case "A1":
        setPageSize(59.4, 84.1);
        break;
      default:
        setPageSize(21.0, 29.7); // Default to A4
    }
  }, [paperSize]);
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerReport.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [11.326301469413806, 55.39925417342158],
      zoom: 16,
      attributionControl: false,
    });
    if (window.map_global) {
      map.on("load", () => {
        map.setStyle(window.map_global.getStyle());
        map.fitBounds(window.map_global.getBounds());
      });
    }
    setMap(map);
    return () => {
      map.remove();
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleMap = () => {
    dispatch(setshowReport(false));
    dispatch(setshowSidebarContent(true));
    dispatch(setshowPiechart(false));
    dispatch(setshowTableMeasurings(false));
  };

  return (
    <div
      style={{
        position: "static",
        width: "100%",
        height: "100%",
      }}
    >
      <Grid>
        <Grid item>
          <Box>
            <div
              style={{
                display: "flex",
              }}
            >
              <div className="report_buttons">
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    marginTop: 1,
                  }}
                >
                  <Box>
                    <Button
                      onClick={handlePrint}
                      variant="contained"
                      sx={{ backgroundColor: "#E91E62", color: "white" }}
                    >
                      {t("Print")}
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      onClick={handleMap}
                      variant="contained"
                      sx={{ backgroundColor: "#E91E62", color: "white" }}
                    >
                      {t("Close")}
                    </Button>
                  </Box>
                  <Box sx={{ minWidth: 10, zIndex: 9999 }}>
                    <Typography>
                      {t("Paper")} {t("Size")}:
                    </Typography>
                    <select value={paperSize} onChange={handleChange}>
                      <option value="A5">A5</option>
                      <option value="A4">A4</option>
                      <option value="A3">A3</option>
                      {/* <option value="A2">A2</option>
                    <option value="A1">A1</option> */}
                    </select>
                  </Box>
                </Box>
              </div>

              <div className="report_print">
                <div style={{ display: "flex" }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: "#666666" }}>
                      {t("Property")} : {current_project_name}
                    </Typography>
                    <Typography sx={{ color: "#666666" }}>
                      {t("Date")} : {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </div>
                <div
                  style={{
                    width: getWidth(),
                    height: getHeight(),
                    border: "1px solid #000",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                  ref={mapContainerReport}
                ></div>
                <Box sx={{ ml: "0%" }}>
                  <PieChartComp showCloseButton={false} />
                </Box>
                <Box sx={{ mt: 5 }}>
                  <div
                    style={{
                      pageBreakBefore:
                        paperSize === "A4" || paperSize === "A5"
                          ? "always"
                          : "auto",
                    }}
                  >
                    <TableMeasuringsForMap
                      width={getWidth()}
                      showCloseButton={false}
                      marginLeftOfTitle={"0%"}
                      mode={"print"}
                    />
                  </div>
                </Box>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
