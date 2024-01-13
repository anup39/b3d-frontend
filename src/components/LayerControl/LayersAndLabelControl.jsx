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
} from "../../reducers/MapView";
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

  const handleCloseMeasurings = () => {
    setExpandMeasurings(!expandMeasurings);
  };

  const handleImportShapefile = () => {
    dispatch(setshowShapefileUpload(!showShapefileUpload));
  };

  const handleShowReport = () => {
    dispatch(setshowReport(true));
    dispatch(setshowMap(false));
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

              <Tooltip title="Report">
                <SummarizeIcon
                  onClick={handleShowReport}
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    mt: 1,
                    mr: 2,
                    color: "#d61b60",
                  }}
                />
              </Tooltip>
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
};
