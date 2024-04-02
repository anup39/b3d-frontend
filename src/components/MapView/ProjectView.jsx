import { Box, IconButton } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import List from "@mui/material/List";
import TiffMapView from "./TiffMapView";
import MoreonProperty from "./MoreonProperty";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  setshowMeasuringsPanel,
  setcurrentTif,
  setshowTableMeasurings,
  setshowPiechart,
  setshowReport,
  setshowTifPanel,
  setCurrentPropertyPolygonGeojson,
} from "../../reducers/MapView";

import { setCurrentMeasuringCategories } from "../../reducers/Client";
import removeCheckedCategoriesLayersFromMap from "../../maputils/removeCheckedCategoriesLayers";

import {
  setcurrentProject,
  setcurrentProjectName,
} from "../../reducers/Project";

import Checkbox from "@mui/material/Checkbox";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  setProjectOpenProperties,
  setProjectChecked,
  setShowEyeButton,
} from "../../reducers/Project";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import { settifs } from "../../reducers/Tifs";
import {
  fetchProjectPolygonGeojsonByClientIdAndProjectId,
  fetchTifDataByProjectId,
  fetchMeasuringCategories,
  fetchBoundingBoxByTifId,
} from "../../api/api";
import AddRasterToMap from "../../maputils/AddRasterToMap";
import { fetchTifDataByClientId } from "../../api/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ProjectView({ project, popUpRef }) {
  const map = window.map_global;
  const dispatch = useDispatch();
  const { current_tif } = useSelector(
    (state) => state.mapView.currentMapDetail
  );
  const current_measuring_categories = useSelector(
    (state) => state.client.current_measuring_categories
  );
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const project_id = useSelector((state) => state.project.project_id);

  const handleTifPanel = () => {
    fetchTifDataByProjectId(project.id).then((res) => {
      const tifs = res;
      tifs.map((tif, index) => {
        if (index === 0) {
          tif.checked = true;
          dispatch(setcurrentTif(tif));
          fetchBoundingBoxByTifId(tif.id).then((res) => {
            if (res) {
              const bounds = res;
              const layerId = `${tif.id}-layer`;
              const sourceId = `${tif.id}-source`;
              const url = `${import.meta.env.VITE_API_RASTER_URL}/tile-async/${
                tif.id
              }/{z}/{x}/{y}.png`;

              AddRasterToMap({
                map: map,
                layerId: layerId,
                sourceId: sourceId,
                url: url,
                source_layer: sourceId,
                zoomToLayer: true,

                extent: bounds,
                type: "raster",
                component: "project-view",
              });
            }
          });
        } else {
          tif.checked = false;
        }
      });
      dispatch(settifs(tifs));
    });
  };
  const handleMeasuringsPanelChecked = (event, project) => {
    const checked = event.target.checked;
    dispatch(setProjectChecked({ id: project.id, value: checked }));
    if (current_measuring_categories) {
      removeCheckedCategoriesLayersFromMap(
        current_measuring_categories,
        client_id,
        map
      );
    }
    if (current_tif) {
      const layerId = `${current_tif.id}-layer`;
      const sourceId = `${current_tif.id}-source`;
      RemoveSourceAndLayerFromMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
      });
    }
    // Here also remove the tifs which was added from all measuremets
    // Here also remove the tif from the map which was added
    // Every time the projected is checked or unchecked the open eye button is show
    dispatch(setShowEyeButton({ id: project.id, value: true }));
    if (checked) {
      fetchTifDataByClientId(client_id).then((res) => {
        const tifs = res;
        tifs.map((tif) => {
          console.log(tif);
          RemoveSourceAndLayerFromMap({
            map: map,
            layerId: `${tif.id}-layer`,
            sourceId: `${tif.id}-source`,
          });
        });
      });
      handleTifPanel();
      dispatch(setshowMeasuringsPanel(true));
      dispatch(setcurrentProject(project.id));
      dispatch(setcurrentProjectName(project.name));
      // This will make the eye button not disable when clicked on the project
      fetchMeasuringCategories(client_id).then((res) => {
        const measuringcategories = res;
        console.log("measuringcategories", measuringcategories);
        dispatch(setCurrentMeasuringCategories(measuringcategories));
      });
      // Here add Property polygon to the map by calling the api
      fetchProjectPolygonGeojsonByClientIdAndProjectId({
        client_id,
        project_id: project.id,
      }).then((res) => {
        const property_polygon_geojson = res;
        dispatch(setCurrentPropertyPolygonGeojson(property_polygon_geojson));
        if (property_polygon_geojson?.features?.length > 0) {
          const layerId = String(client_id) + String(project.id) + "layer";
          const sourceId = String(client_id) + String(project.id) + "source";
          AddLayerAndSourceToMap({
            map,
            layerId: layerId,
            sourceId: sourceId,
            url: `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/project-polygon/?client=${client_id}&project=${project.id}`,
            source_layer: sourceId,
            popUpRef: popUpRef,
            showPopup: false,
            style: {
              fill_color: "red",
              fill_opacity: 0.5,
              stroke_color: "red",
              stroke_width: 2,
            },
            zoomToLayer: false,
            extent: [],
            geomType: "geojson",
            fillType: "line",
            trace: false,
            component: "project-view",
          });
        }
      });
      // Here also removed the property polygon which is previosuly in the map
      if (project_id) {
        RemoveSourceAndLayerFromMap({
          map: map,
          sourceId: String(client_id) + String(project_id) + "source",
          layerId: String(client_id) + String(project_id) + "layer",
        });
      }
    } else {
      dispatch(settifs([]));
      dispatch(setshowMeasuringsPanel(false));
      dispatch(setcurrentProjectName(null));
      dispatch(setcurrentProject(null));
      dispatch(setCurrentMeasuringCategories(null));
      dispatch(setcurrentTif(null));
      dispatch(setshowTableMeasurings(false));
      dispatch(setshowPiechart(false));
      dispatch(setshowReport(false));
      dispatch(setshowTifPanel(false));
      RemoveSourceAndLayerFromMap({
        map: map,
        sourceId: String(client_id) + String(project.id) + "source",
        layerId: String(client_id) + String(project.id) + "layer",
      });
    }
  };

  const handleEyeButton = () => {
    dispatch(setShowEyeButton({ id: project.id, value: false }));
    // Here remove the property polygon to map the Map
    const map = window.map_global;
    const project_id = project.id;
    RemoveSourceAndLayerFromMap({
      map: map,
      sourceId: String(client_id) + String(project_id) + "source",
      layerId: String(client_id) + String(project_id) + "layer",
    });
  };

  const handleHideButton = () => {
    dispatch(setShowEyeButton({ id: project.id, value: true }));

    // Here add the property polygon to map the Map
    const map = window.map_global;
    const project_id = project.id;
    if (project) {
      const layerId = String(client_id) + String(project_id) + "layer";
      const sourceId = String(client_id) + String(project_id) + "source";
      const style = map.getStyle();
      const existingLayer = style?.layers?.find(
        (layer) => layer.id === layerId
      );
      const existingSource = style?.sources[sourceId];
      if (existingLayer) {
        map.off("click", layerId);
        map.removeLayer(layerId);
      }
      if (existingSource) {
        map.removeSource(sourceId);
      }
      AddLayerAndSourceToMap({
        map,
        layerId: layerId,
        sourceId: sourceId,
        url: `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/project-polygon/?client=${client_id}&project=${project_id}`,
        source_layer: sourceId,
        popUpRef: popUpRef,
        showPopup: true,
        style: {
          fill_color: "red",
          fill_opacity: 0.5,
          stroke_color: "red",
          stroke_width: 2,
        },
        zoomToLayer: false,
        extent: [],
        geomType: "geojson",
        fillType: "line",
        trace: false,
        component: "project-view",
      });
    }
  };

  return (
    <Box>
      <ListItem
        key={project.id}
        disablePadding
        sx={{ display: "block", fontSize: 20, mr: 1, ml: 0.5 }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "center" : "center",
            "&:hover": {
              backgroundColor: "#F1F7FF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "18px",
              mr: open ? 0 : "auto",
              justifyContent: "space-evenly",
            }}
          >
            <LocationCityIcon />
          </ListItemIcon>

          <MoreonProperty
            project_id={project.id}
            // onClick={() => setOpenProperties(!openProperties)}
          />

          <Box sx={{ minWidth: 80 }}>
            <ListItemText
              secondary={project.name.slice(0, 10)}
              sx={{ opacity: open ? 1 : 0 }}
              secondaryTypographyProps={{ fontSize: 11, color: "#027FFE" }}
            />
            <ListItemText
              secondary={project.description.slice(0, 10)}
              sx={{ opacity: open ? 1 : 0 }}
              secondaryTypographyProps={{
                fontSize: 11,
              }}
            />
          </Box>

          <Tooltip title="Show Measurings">
            <Checkbox
              onChange={(event) => handleMeasuringsPanelChecked(event, project)}
              size="small"
              {...label}
              checked={project.checked}
              sx={{
                color: pink[600],
                "&.Mui-checked": {
                  color: pink[600],
                },
              }}
            />
          </Tooltip>

          {project.show_eye_button ? (
            <IconButton
              onClick={handleEyeButton}
              disabled={project_id === project.id ? false : true}
            >
              <Tooltip title="Show Area">
                <RemoveRedEyeIcon sx={{ fontSize: 14 }} />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton
              onClick={handleHideButton}
              disabled={project_id === project.id ? false : true}
            >
              <Tooltip title="Show Area">
                <VisibilityOffIcon sx={{ fontSize: 14 }} />
              </Tooltip>
            </IconButton>
          )}

          {project.openProperties ? (
            <IconButton
              disabled={project_id === project.id ? false : true}
              onClick={() => {
                dispatch(
                  setProjectOpenProperties({ id: project.id, value: false })
                );
              }}
            >
              <ExpandLess />
            </IconButton>
          ) : (
            <IconButton
              disabled={project_id === project.id ? false : true}
              onClick={() => {
                dispatch(
                  setProjectOpenProperties({ id: project.id, value: true })
                );
              }}
            >
              <ExpandMore />
            </IconButton>
          )}
        </ListItemButton>
        <Collapse in={project.openProperties} timeout="auto" unmountOnExit>
          <List sx={{ fontSize: 2 }} component="div" disablePadding>
            <TiffMapView projectId={project.id} />
          </List>
        </Collapse>
      </ListItem>
    </Box>
  );
}

ProjectView.propTypes = {
  project: PropTypes.object,
  popUpRef: PropTypes.object,
};
