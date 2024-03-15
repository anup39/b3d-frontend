import LayersControlPanel from "./LayerControlPanel";
import { Box, Tooltip, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BackupIcon from "@mui/icons-material/Backup";
import TableChartIcon from "@mui/icons-material/TableChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreLess from "@mui/icons-material/ExpandLess";
import PieChartIcon from "@mui/icons-material/PieChart";
import { pink } from "@mui/material/colors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setshowShapefileUpload,
  setshowReport,
  setshowMap,
  setshowTableMeasurings,
  setshowPiechart,
  setTableSummationData,
  setCurrentMapExtent,
} from "../../reducers/MapView";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setFeatureId,
  setMode,
} from "../../reducers/DrawnGeometry";
import RectangleIcon from "@mui/icons-material/Rectangle";
import axios from "axios";

export default function LayersAndLabelControl({ map, popUpRef }) {
  const dispatch = useDispatch();
  const [expandMeasurings, setExpandMeasurings] = useState(true);
  const showMeasuringsPanel = useSelector(
    (state) => state.mapView.showMeasuringsPanel
  );
  const showShapefileUpload = useSelector(
    (state) => state.mapView.showShapefileUpload
  );
  const showTableMeasurings = useSelector(
    (state) => state.mapView.showTableMeasurings
  );
  const current_project_name = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_name
  );

  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const currentProject = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );

  const showPiechart = useSelector((state) => state.mapView.showPiechart);
  const mode = useSelector((state) => state.drawnPolygon.mode);

  const handleCloseMeasurings = () => {
    setExpandMeasurings(!expandMeasurings);
  };

  const handleImportShapefile = () => {
    dispatch(setshowShapefileUpload(!showShapefileUpload));
  };

  const handleShowReport = () => {
    if (currentClient && currentProject) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/measuring-table-summation/?client=${currentClient}&project=${currentProject}`
        )
        .then((res) => {
          if (res.data.rows.length > 0) {
            dispatch(setTableSummationData(res.data.rows));
          } else {
            dispatch(setTableSummationData([]));
          }
        });
    }
    dispatch(setshowTableMeasurings(!showTableMeasurings));
    dispatch(setshowPiechart(!showPiechart));
    dispatch(setshowReport(true));
    dispatch(setshowMap(false));

    const map = window.map_global;
    const bounds = map.getBounds();
    dispatch(setCurrentMapExtent(bounds.toArray()));
  };

  const handleMeasuringsTable = () => {
    if (currentClient && currentProject) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/measuring-table-summation/?client=${currentClient}&project=${currentProject}`
        )
        .then((res) => {
          if (res.data.rows.length > 0) {
            dispatch(setTableSummationData(res.data.rows));
          } else {
            dispatch(setTableSummationData([]));
          }
        });
    }
    dispatch(setshowTableMeasurings(!showTableMeasurings));
  };

  const handlePieChart = () => {
    if (currentClient && currentProject) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/measuring-table-summation/?client=${currentClient}&project=${currentProject}`
        )
        .then((res) => {
          if (res.data.rows.length > 0) {
            dispatch(setTableSummationData(res.data.rows));
          } else {
            dispatch(setTableSummationData([]));
          }
        });
    }
    dispatch(setshowPiechart(!showPiechart));
  };

  const handleDrawPolygon = () => {
    const draw = map.draw;
    draw.deleteAll();
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setId(null));
    dispatch(setViewName(null));
    dispatch(setFeatureId(null));

    if (mode && mode === "Edit") {
      const layerId = String(currentClient) + `${currentProject}` + "layer";
      map.setFilter(layerId, null);
    }
    draw.changeMode("draw_polygon");
    dispatch(setId(currentProject));
    dispatch(
      setViewName(String(currentClient) + `${currentProject}` + "layer")
    );
    dispatch(setMode("Draw"));
    map.on("draw.create", function (event) {
      console.log(map, "map when drawing");
      const feature = event.features;
      const geometry = feature[0].geometry;
      const type_of_geometry = feature[0].geometry.type;
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
    });
    map.on("draw.update", function (event) {
      const draw = map.draw;
      console.log(draw, "draw update");
      const feature = event.features;
      const geometry = feature[0].geometry;
      const type_of_geometry = feature[0].geometry.type;
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
    });
  };
  return (
    <>
      {showMeasuringsPanel ? (
        <div
          className="maplibregl-ctrl-layer-control"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 99999,
              }}
            >
              <Typography
                sx={{
                  backgroundColor: "white",
                  fontWeight: "bold",
                  marginTop: 1,
                  marginBottom: 0,
                  paddingTop: 0,
                  marginLeft: 2,
                  fontSize: "14px",
                  color: "#027FFE",
                }}
              >
                Measurings :{" "}
                <span style={{ color: "#757575", marginRight: "20px" }}>
                  {current_project_name ? current_project_name : null}
                </span>
              </Typography>
              <Box></Box>

              {/* <Tooltip title="Report"> */}
              <SummarizeIcon
                onClick={handleShowReport}
                sx={{
                  "&:hover": { cursor: "pointer" },
                  mt: 1,
                  color: "#d61b60",
                }}
              />
              <span
                style={{ marginTop: "10px", padding: 2, marginRight: "10px" }}
              >
                Report
              </span>
              {/* </Tooltip> */}
              <Tooltip title="Import">
                <BackupIcon
                  onClick={handleImportShapefile}
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    mt: 1,
                    mr: 1,
                    color: "#d61b60",
                  }}
                />
              </Tooltip>
              <Tooltip title="Table">
                <TableChartIcon
                  onClick={handleMeasuringsTable}
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    mt: 1,
                    mr: 1,
                    color: "#d61b60",
                  }}
                />
              </Tooltip>
              <Tooltip title="Pie Chart">
                <PieChartIcon
                  onClick={handlePieChart}
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    mt: 1,
                    mr: 1,
                    color: "#d61b60",
                  }}
                />
              </Tooltip>
              <Tooltip title="Draw Polygon">
                <RectangleIcon
                  onClick={handleDrawPolygon}
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    mt: 1,
                    mr: 1,
                    color: "#d61b60",
                  }}
                />
              </Tooltip>
            </Box>

            {expandMeasurings ? (
              <LayersControlPanel map={map} popUpRef={popUpRef} />
            ) : null}

            {expandMeasurings ? (
              <ExpandMoreLess
                onClick={handleCloseMeasurings}
                sx={{
                  ml: "50%",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  color: pink[600],
                  // position: "fixed",
                }}
              />
            ) : (
              <ExpandMoreIcon
                onClick={handleCloseMeasurings}
                sx={{
                  ml: "50%",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  color: pink[600],
                  // position: "fixed",
                }}
              />
            )}
          </Box>
        </div>
      ) : null}
    </>
  );
}

LayersAndLabelControl.propTypes = {
  map: PropTypes.object,
  popUpRef: PropTypes.object,
};
