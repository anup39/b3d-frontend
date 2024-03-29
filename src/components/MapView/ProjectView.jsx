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
import axios from "axios";
import { Tooltip } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  setcurrentProjectName,
  setshowMeasuringsPanel,
  setcurrentProjectMeasuring,
  setCurrentMeasuringCategories,
  setcurrentTif,
  setshowTableMeasurings,
  setshowPiechart,
  setshowReport,
  setshowTifPanel,
  setCurrentPropertyPolygonGeojson,
} from "../../reducers/MapView";
import Checkbox from "@mui/material/Checkbox";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  setProjectOpenProperties,
  setProjectChecked,
  setShowArea,
  setShowAreaDisabled,
} from "../../reducers/Project";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import { settifs } from "../../reducers/Tifs";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ProjectView({ project, popUpRef }) {
  const dispatch = useDispatch();

  const tifs = useSelector((state) => state.tifs.tifs);
  const openSidebar = useSelector((state) => state.mapView.openSidebar);

  const { current_measuring_categories, project_id, current_tif } = useSelector(
    (state) => state.mapView.currentMapDetail
  );

  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );

  // useEffect(() => {
  //   return () => {
  //     dispatch(settifs([]));
  //   };
  // }, [project, dispatch]);

  const handleSetTifs = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${
          project.id
        }`
      )
      .then((res) => {
        // const data = res.data.map((item, index) => ({
        //   ...item,
        //   checked: index === 0, // true for the first item, false for the rest
        // }));
        // setTifs(data);
        // console.log(data, "tiff data");
        const tifs = res.data;
        tifs.map((tif, index) => {
          if (index === 0) {
            tif.checked = true;
          } else {
            tif.checked = false;
          }
        });
        dispatch(settifs(tifs));
      });
  };

  // const selected_projects_ids = useSelector(
  //   (state) => state.mapView.currentMapDetail.selected_projects_ids
  // );

  const handleMeasuringsPanelChecked = (event, project_id) => {
    const checked = event.target.checked;
    console.log(project_id, "project_id from event");
    dispatch(setProjectChecked({ id: project_id, value: checked }));
    if (checked) {
      handleSetTifs();
      dispatch(setCurrentMeasuringCategories(null));
      dispatch(setshowMeasuringsPanel(true));
      // dispatch(addSelectedProjectId(id));
      dispatch(setcurrentProjectName(project.name));
      dispatch(setcurrentProjectMeasuring(project_id));
      dispatch(setShowAreaDisabled({ id: project_id, value: false }));

      console.log(client_id, "client_id from state");
      console.log(project_id, "project_id from state");

      // Here add Property polygon to the map by calling the api
      const map = window.map_global;
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/project-polygon/?client=${client_id}&project=${project_id}`
        )
        .then((res) => {
          const property_polygon_geojson = res.data;
          if (property_polygon_geojson?.features?.length > 0) {
            const layerId = String(client_id) + String(project_id) + "layer";
            const sourceId = String(client_id) + String(project_id) + "source";
            AddLayerAndSourceToMap({
              map,
              layerId: layerId,
              sourceId: sourceId,
              url: `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/project-polygon/?client=${client_id}&project=${project_id}`,
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

          // Now add the property polygon geojson from the current Mapview state
          dispatch(setCurrentPropertyPolygonGeojson(property_polygon_geojson));
        })
        .catch((err) => {
          console.log(err, "property-polygon error");
        });
      // Here also removed the property polygon which is previosuly in the map
      if (project_id) {
        RemoveSourceAndLayerFromMap({
          map: map,
          sourceId: String(client_id) + String(project_id) + "source",
          layerId: String(client_id) + String(project_id) + "layer",
        });
      }
      // Here when another project is clicked make the eye button back to default
      if (project_id) {
        dispatch(setShowArea({ id: project_id, value: true }));
      }
    } else {
      dispatch(setCurrentMeasuringCategories(null));
      dispatch(setshowMeasuringsPanel(false));
      // dispatch(removeSelectedProjectId(id));
      dispatch(setcurrentProjectName(null));
      dispatch(setcurrentProjectMeasuring(null));
      dispatch(setCurrentMeasuringCategories(null));
      dispatch(setcurrentTif(null));
      dispatch(setshowTableMeasurings(false));
      dispatch(setshowPiechart(false));
      dispatch(setshowReport(false));
      dispatch(setshowTifPanel(false));
      dispatch(setShowAreaDisabled({ id: project_id, value: true }));

      const map = window.map_global;

      const measuringcategories = current_measuring_categories;
      if (measuringcategories) {
        measuringcategories?.forEach((measuringcategory) => {
          measuringcategory?.sub_category?.forEach((sub_category) => {
            sub_category?.category?.forEach((cat) => {
              if (cat.checked) {
                if (cat.type_of_geometry) {
                  const sourceId = String(client_id) + cat.view_name + "source";
                  const layerId = String(client_id) + cat.view_name + "layer";
                  if (map) {
                    RemoveSourceAndLayerFromMap({ map, sourceId, layerId });
                  }
                }
              }
            });
          });
        });
      }
      if (current_tif) {
        const id = current_tif.id;
        const style = map.getStyle();
        const existingLayer = style?.layers?.find(
          (layer) => layer.id === `${id}-layer`
        );
        const existingSource = style?.sources[`${id}-source`];
        if (existingLayer) {
          map.off("click", `${id}-layer`);
          map.removeLayer(`${id}-layer`);
        }
        if (existingSource) {
          map.removeSource(`${id}-source`);
        }
      }
      RemoveSourceAndLayerFromMap({
        map: map,
        sourceId: String(client_id) + String(project_id) + "source",
        layerId: String(client_id) + String(project_id) + "layer",
      });

      // Here when the  project is un clicked make the eye button back to default
      if (project_id) {
        dispatch(setShowArea({ id: project_id, value: true }));
      }

      // Now remove the property polygon geojson from the current Mapview state
      dispatch(setCurrentPropertyPolygonGeojson(null));
    }
  };

  const handleEyeButton = () => {
    dispatch(setShowArea({ id: project.id, value: false }));
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
    dispatch(setShowArea({ id: project.id, value: true }));

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
        sx={{ display: "block", fontSize: 28 }}
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
              minWidth: "24px",
              mr: open ? 0 : "auto",
              justifyContent: "center",
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
              onChange={(event) =>
                handleMeasuringsPanelChecked(event, project.id)
              }
              size="small"
              {...label}
              // defaultChecked={false}
              // checked={
              //   project_id === project.id ? true : false
              // }
              checked={project.checked}
              sx={{
                color: pink[600],
                "&.Mui-checked": {
                  color: pink[600],
                },
              }}
            />
          </Tooltip>

          {project.show_area ? (
            <IconButton
              onClick={handleEyeButton}
              disabled={project_id === project.id ? false : true} // Set this to the condition when you want to disable the button
            >
              <Tooltip title="Show Area">
                <RemoveRedEyeIcon sx={{ fontSize: 14 }} />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton
              onClick={handleHideButton}
              disabled={project_id === project.id ? false : true} // Set this to the condition when you want to disable the button
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
            {tifs && tifs.length > 0
              ? tifs.map((tif) => (
                  <TiffMapView key={tif.id} tif={tif} projectId={project.id} />
                ))
              : null}
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
