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
import { IconButton, Tooltip } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { pink } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { setshowMeasuringsPanel } from "../../reducers/MapView";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ProjectView({ project }) {
  const dispatch = useDispatch();
  const [openProperties, setOpenProperties] = useState(true);
  const [tifs, setTifs] = useState([]);

  const showMeasuringsPanel = useSelector(
    (state) => state.mapView.showMeasuringsPanel
  );

  const selected_projects_ids = useSelector(
    (state) => state.mapView.currentMapDetail.selected_projects_ids
  );

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: pink[600],
      "&:hover": {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: pink[600],
    },
  }));

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

  const handleMeasuringsPanelChecked = (event, tif_id) => {
    console.log(event, tif_id, "measurings ");
    const checked = event.target.checked;
    const id = tif_id;
    const map = window.map_global;
    if (checked) {
      dispatch(setshowMeasuringsPanel(true));
    } else {
      dispatch(setshowMeasuringsPanel(false));
    }
  };

  const handleMeasuringsPanelOpen = (event, project_id) => {
    dispatch(setshowMeasuringsPanel(!showMeasuringsPanel));
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
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            "&:hover": {
              backgroundColor: "#F1F7FF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "24px",
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <LocationCityIcon />
          </ListItemIcon>
          <IconButton
            onClick={(event) => handleMeasuringsPanelOpen(event, project.id)}
            disabled={selected_projects_ids.includes(project.id) ? false : true}
          >
            <Tooltip title="Show Measurings">
              <PinkSwitch
                onChange={(event) =>
                  handleMeasuringsPanelChecked(event, project.id)
                }
                size="small"
                {...label}
                defaultChecked={false}
              />
            </Tooltip>
          </IconButton>
          <MoreonProperty
            project_id={project.id}
            onClick={() => setOpenProperties(!openProperties)}
          />

          <ListItemText
            secondary={project.name}
            sx={{ opacity: open ? 1 : 0 }}
          />

          {openProperties ? (
            <ExpandLess onClick={() => setOpenProperties(!openProperties)} />
          ) : (
            <ExpandMore onClick={() => setOpenProperties(!openProperties)} />
          )}
        </ListItemButton>
        <Collapse in={openProperties} timeout="auto" unmountOnExit>
          <List sx={{ fontSize: 2 }} component="div" disablePadding>
            {tifs && tifs.length > 0
              ? tifs.map((tif) => <TiffMapView key={tif.id} tif={tif} />)
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
