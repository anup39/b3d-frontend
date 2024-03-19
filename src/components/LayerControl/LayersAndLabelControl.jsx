import LayersControlPanel from "./LayerControlPanel";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { PropTypes, object } from "prop-types";
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
  setComponent,
} from "../../reducers/DrawnGeometry";
import RectangleIcon from "@mui/icons-material/Rectangle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";

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

  const currentPropertyPolygonGeojson = useSelector(
    (state) => state.mapView.currentMapDetail.current_property_polygon_geojson
  );

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
    dispatch(setComponent(null));

    if (mode && mode === "Edit") {
      const layerId = String(currentClient) + `${currentProject}` + "layer";
      map.setFilter(layerId, null);
    }
    draw.changeMode("draw_polygon");
    dispatch(setId(currentProject));
    dispatch(setViewName(`${currentProject}`));
    dispatch(setMode("Draw"));
    dispatch(setComponent("project"));
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

  const handleEditPolygon = () => {
    console.log("edit polygon");
    // First of all remove the existing popup in the map
    const popups = document.getElementsByClassName("mapboxgl-popup");
    if (popups.length > 0) {
      popups[0].remove();
    }

    // now get he draw object from the map
    const draw = map.draw;
    draw.deleteAll();

    // Now before adding the current features to the map we need to get it from the map
    const features = map.queryRenderedFeatures({
      layers: [`${currentClient}${currentProject}layer`],
    });
    console.log(features, "features");
    // Now add the features to the to draw mode
    draw.add(features[0]);
    // also once the is added to map remove the layer from the map
    const layerId = String(currentClient) + `${currentProject}` + "layer";
    const sourceId = String(currentClient) + `${currentProject}` + "source";
    RemoveSourceAndLayerFromMap({ map, sourceId, layerId });

    // Now update the drawPolygon state with the current geometry
    map.on("draw.update", function (event) {
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
        dispatch(setMode("Edit"));
        dispatch(setComponent("project"));
        dispatch(setId(currentProject));
        dispatch(setViewName(`${currentProject}`));
        dispatch(setFeatureId(feature[0].id));
      }
    });
  };

  const handleDeletePolygon = () => {
    console.log("delete polygon");
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

              <IconButton
                disabled={
                  currentPropertyPolygonGeojson?.features?.length > 0
                    ? true
                    : false
                }
                onClick={handleDrawPolygon}
              >
                <Tooltip
                  title={
                    currentPropertyPolygonGeojson?.features?.length > 0
                      ? "Already drawn polygon exists. Please delete it first."
                      : "Draw Polygon"
                  }
                >
                  <RectangleIcon
                    sx={{
                      "&:hover": { cursor: "pointer" },
                      mt: 1,
                      mr: 1,
                      color:
                        currentPropertyPolygonGeojson?.features?.length > 0
                          ? false
                          : "#d61b60",
                    }}
                  />
                </Tooltip>
              </IconButton>

              <Box>
                <IconButton
                  disabled={
                    currentPropertyPolygonGeojson?.features?.length > 0
                      ? false
                      : true
                  }
                  onClick={handleEditPolygon}
                >
                  <Tooltip title="Edit Poygon">
                    <EditIcon
                      sx={{
                        "&:hover": { cursor: "pointer" },
                        mt: 1,
                        mr: 1,

                        color:
                          currentPropertyPolygonGeojson?.features?.length > 0
                            ? "#d61b60"
                            : false,
                      }}
                    />
                  </Tooltip>
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  disabled={
                    currentPropertyPolygonGeojson?.features?.length > 0
                      ? false
                      : true
                  }
                  onClick={handleDeletePolygon}
                >
                  <Tooltip title="Delete Poygon">
                    <DeleteIcon
                      sx={{
                        "&:hover": { cursor: "pointer" },
                        mt: 1,
                        mr: 1,
                        color:
                          currentPropertyPolygonGeojson?.features?.length > 0
                            ? "#d61b60"
                            : false,
                      }}
                    />
                  </Tooltip>
                </IconButton>
              </Box>
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
