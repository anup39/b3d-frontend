import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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
  addcurrentProjectMeasuringTable,
  setCategoriesState,
  setcurrentTif,
  setshowTableMeasurings,
  setshowPiechart,
  setshowReport,
  setshowTifPanel,
} from "../../reducers/MapView";
import Checkbox from "@mui/material/Checkbox";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { setShowArea } from "../../reducers/Project";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ProjectView({ project }) {
  const dispatch = useDispatch();
  const [openProperties, setOpenProperties] = useState(false);
  const [tifs, setTifs] = useState([]);

  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );

  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );

  const current_tif = useSelector(
    (state) => state.mapView.currentMapDetail.current_tif
  );

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${
          project.id
        }`
      )
      .then((res) => {
        setTifs(res.data);
      });
  }, [project]);

  // const selected_projects_ids = useSelector(
  //   (state) => state.mapView.currentMapDetail.selected_projects_ids
  // );

  const current_project_measuring_table = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );

  const handleMeasuringsPanelChecked = (event, project_id) => {
    const checked = event.target.checked;
    if (checked) {
      dispatch(setCategoriesState(null));
      dispatch(setshowMeasuringsPanel(true));
      // dispatch(addSelectedProjectId(id));
      dispatch(setcurrentProjectName(project.name));
      dispatch(addcurrentProjectMeasuringTable(project_id));
    } else {
      dispatch(setCategoriesState(null));
      dispatch(setshowMeasuringsPanel(false));
      // dispatch(removeSelectedProjectId(id));
      dispatch(setcurrentProjectName(null));
      dispatch(addcurrentProjectMeasuringTable(null));
      dispatch(setCategoriesState(null));
      dispatch(setcurrentTif(null));
      dispatch(setshowTableMeasurings(false));
      dispatch(setshowPiechart(false));
      dispatch(setshowReport(false));
      dispatch(setshowTifPanel(false));

      const map = window.map_global;

      const measuringcategories = current_measuring_categories;
      if (measuringcategories) {
        measuringcategories?.forEach((measuringcategory) => {
          measuringcategory?.sub_category?.forEach((sub_category) => {
            sub_category?.category?.forEach((cat) => {
              if (cat.checked) {
                if (cat.type_of_geometry) {
                  const sourceId =
                    String(currentClient) + cat.view_name + "source";
                  const layerId =
                    String(currentClient) + cat.view_name + "layer";
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
            justifyContent: open ? "space-between" : "center",
            // px: 2,
            "&:hover": {
              backgroundColor: "#F1F7FF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "24px",
              mr: open ? 1 : "auto",
              justifyContent: "center",
            }}
          >
            <LocationCityIcon />
          </ListItemIcon>

          <MoreonProperty
            project_id={project.id}
            onClick={() => setOpenProperties(!openProperties)}
          />

          <Box sx={{ minWidth: 80 }}>
            <ListItemText
              secondary={project.name.slice(0, 10)}
              sx={{ opacity: open ? 1 : 0 }}
              secondaryTypographyProps={{ fontSize: 12, color: "#027FFE" }}
            />
            <ListItemText
              secondary={project.description.slice(0, 10)}
              sx={{ opacity: open ? 1 : 0 }}
              secondaryTypographyProps={{
                fontSize: 12,
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
              checked={
                current_project_measuring_table === project.id ? true : false
              }
              sx={{
                color: pink[600],
                "&.Mui-checked": {
                  color: pink[600],
                },
              }}
            />
          </Tooltip>

          {project.show_area ? (
            <Tooltip title="Hide Area">
              <RemoveRedEyeIcon
                onClick={() => dispatch(setShowArea(project.id, false))}
                sx={{ fontSize: 14 }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Show Area">
              <VisibilityOffIcon
                onClick={() => dispatch(setShowArea(project.id, true))}
                sx={{ fontSize: 14 }}
              />
            </Tooltip>
          )}

          {openProperties ? (
            <ExpandLess onClick={() => setOpenProperties(!openProperties)} />
          ) : (
            <ExpandMore onClick={() => setOpenProperties(!openProperties)} />
          )}
        </ListItemButton>
        <Collapse in={openProperties} timeout="auto" unmountOnExit>
          <List sx={{ fontSize: 2 }} component="div" disablePadding>
            {tifs && tifs.length > 0
              ? tifs.map((tif) => (
                  <TiffMapView key={tif.id} tif={tif} project_id={project.id} />
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
};
