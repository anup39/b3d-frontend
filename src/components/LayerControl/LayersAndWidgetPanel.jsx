import LayersPanel from "./LayersPanel";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
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
  setshowTableMeasurings,
  setshowPiechart,
  setCurrentMapExtent,
  setCurrentPropertyPolygonGeojson,
  setshowSidebarContent,
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
import {
  deletePropertyPolygonByPolygonId,
  fetchProjectPolygonGeojsonByClientIdAndProjectId,
} from "../../api/api";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import fetchTableSummationData from "./fetchTableSummationData";
import fetchPieSummationData from "./fetchPieSummationData";
import { useTranslation } from "react-i18next";

export default function LayersAndWidgetControl({ map, popUpRef }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [expandMeasurings, setExpandMeasurings] = useState(true);
  const { mode, view_name } = useSelector((state) => state.drawnPolygon);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const {
    showMeasuringsPanel,
    showShapefileUpload,
    showTableMeasurings,
    showPiechart,
    showReport,
  } = useSelector((state) => state.mapView);

  const { tableSummationData, tableSummationPieData } = useSelector(
    (state) => state.mapView
  );

  const currentPropertyPolygonGeojson = useSelector(
    (state) => state.mapView.currentMapDetail.current_property_polygon_geojson
  );

  const { project_id, current_project_name } = useSelector(
    (state) => state.project
  );
  const group_name = useSelector((state) => state.auth.role.group_name);

  const handleCloseMeasurings = () => {
    setExpandMeasurings(!expandMeasurings);
  };

  const handleImportShapefile = () => {
    dispatch(setshowShapefileUpload(!showShapefileUpload));
  };

  const handleShowReport = () => {
    // if (
    //   client_id &&
    //   project_id &&
    //   tableSummationData.length === 0 &&
    //   tableSummationPieData.length === 0
    // ) {
    //   fetchTableSummationData(client_id, project_id, dispatch);
    //   fetchPieSummationData(client_id, project_id, dispatch);
    // }
    dispatch(setshowTableMeasurings(true));
    dispatch(setshowPiechart(true));
    dispatch(setshowReport(!showReport));
    dispatch(setshowSidebarContent(false));
    // dispatch(setshowMap(false));

    const map = window.map_global;
    const bounds = map.getBounds();
    dispatch(setCurrentMapExtent(bounds.toArray()));
  };

  const handleMeasuringsTable = () => {
    // if (client_id && project_id && tableSummationData.length === 0) {
    //   fetchTableSummationData(client_id, project_id, dispatch);
    // }
    dispatch(setshowTableMeasurings(!showTableMeasurings));
  };

  const handlePieChart = () => {
    // if (client_id && project_id && tableSummationData.length === 0) {
    //   fetchPieSummationData(client_id, project_id, dispatch);
    // }
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
      const layerId = String(client_id) + `${project_id}` + "layer";
      map.setFilter(layerId, null);
    }
    draw.changeMode("draw_polygon");
    dispatch(setId(project_id));
    dispatch(setViewName(`${project_id}`));
    dispatch(setMode("Draw"));
    dispatch(setComponent("project"));
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
      layers: [`${client_id}${project_id}layer`],
    });
    console.log(features, "features");
    // Now add the features to the to draw mode
    draw.add(features[0]);
    // also once the is added to map remove the layer from the map
    if (view_name) {
      const layerId = String(client_id) + `${view_name}` + "layer";
      map.setFilter(layerId, null);
    }
    const layerId = String(client_id) + `${project_id}` + "layer";
    map.setFilter(layerId, null);
    const layer = map.getLayer(layerId);
    const existingFilter = layer.filter || ["all"];
    const feature_id = features[0].id;
    const filterCondition = ["!=", ["id"], feature_id];
    const updatedFilter = ["all", existingFilter, filterCondition];
    map.setFilter(layerId, updatedFilter);

    dispatch(setMode("Edit"));
    dispatch(setComponent("project"));
    dispatch(setId(project_id));
    dispatch(setViewName(`${project_id}`));
    dispatch(setFeatureId(feature_id));
  };

  const handleDeletePolygon = () => {
    const property_id = currentPropertyPolygonGeojson?.features[0]?.id;
    deletePropertyPolygonByPolygonId(property_id)
      .then(() => {
        dispatch(settoastType("success"));
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Property Polygon Deleted Successfully"));
        map
          .getSource(String(client_id) + String(project_id) + "source")
          .setData(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/project-polygon/?client=${client_id}&project=${project_id}`
          );
        fetchProjectPolygonGeojsonByClientIdAndProjectId({
          client_id,
          project_id,
        }).then((res) => {
          dispatch(setCurrentPropertyPolygonGeojson(res));
        });
      })
      .catch(() => {
        dispatch(settoastType("error"));
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Error Deleting Property Polygon"));
      });
  };
  return (
    <>
      {showMeasuringsPanel ? (
        <div
          className="maplibregl-ctrl-layer-control"
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              backgroundColor: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                backgroundColor: "white",
                fontWeight: "bold",
                marginTop: 1,
                marginBottom: 0,
                paddingTop: 0,
                fontSize: "14px",
                color: "#027FFE",
                marginLeft: "10px",
              }}
            >
              {t("Measurings")} :{" "}
              <span style={{ color: "#757575", marginRight: "20px" }}>
                {current_project_name ? current_project_name : null}
              </span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                zIndex: 99999,
                marginLeft: "10px",
              }}
            >
              {/* Report Button */}

              {project_id !== "All" ? (
                <>
                  {" "}
                  <SummarizeIcon
                    onClick={handleShowReport}
                    sx={{
                      "&:hover": { cursor: "pointer" },
                      mt: 1,
                      mr: 1,
                      color: "#d61b60",
                    }}
                  />
                  {/* <span
                    style={{
                      marginTop: "10px",
                      padding: 2,
                      marginRight: "10px",
                      color: "#027FFE",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Report")}
                  </span> */}
                </>
              ) : null}

              {/* Import Shapefile Button */}
              {(group_name === "super_admin" ||
                group_name === "admin" ||
                group_name === "editor") &&
              project_id !== "All" ? (
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
              ) : null}
              {/* Table Button */}
              {project_id !== "All" ? (
                <Tooltip title={t("Table")}>
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
              ) : null}

              {/* Pie Chart Button */}
              {project_id !== "All" ? (
                <Tooltip title={t("Piechart")}>
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
              ) : null}

              {/* Draw Polygon Button */}
              {(group_name === "super_admin" ||
                group_name === "admin" ||
                group_name === "editor") &&
              project_id !== "All" ? (
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
                        : `${t("Draw")} ${t("Polygon")} ${t("Property")} `
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
              ) : null}

              {/* Edit Polygon Button */}
              {(group_name === "super_admin" ||
                group_name === "admin" ||
                group_name === "editor") &&
              project_id !== "All" ? (
                <Box>
                  <IconButton
                    disabled={
                      currentPropertyPolygonGeojson?.features?.length > 0
                        ? false
                        : true
                    }
                    onClick={handleEditPolygon}
                  >
                    <Tooltip
                      title={
                        t("Edit") + " " + t("Polygon") + " " + t("Property")
                      }
                    >
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
              ) : null}

              {/* Delete Polygon Button */}

              {(group_name === "super_admin" || group_name === "admin") &&
              project_id !== "All" ? (
                <Box>
                  <IconButton
                    disabled={
                      currentPropertyPolygonGeojson?.features?.length > 0
                        ? false
                        : true
                    }
                    onClick={handleDeletePolygon}
                  >
                    <Tooltip
                      title={
                        t("Delete") + " " + t("Polygon") + " " + t("Property")
                      }
                    >
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
              ) : null}
            </Box>

            {expandMeasurings ? (
              <LayersPanel map={map} popUpRef={popUpRef} />
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

LayersAndWidgetControl.propTypes = {
  map: PropTypes.object,
  popUpRef: PropTypes.object,
};
