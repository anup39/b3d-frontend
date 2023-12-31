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
import { useDispatch } from "react-redux";
import {
  addSelectedProjectId,
  removeSelectedProjectId,
  setshowMeasuringsPanel,
} from "../../reducers/MapView";
import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ProjectView({ project }) {
  const dispatch = useDispatch();
  const [openProperties, setOpenProperties] = useState(true);
  const [tifs, setTifs] = useState([]);

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

  const handleMeasuringsPanelChecked = (event, project_id) => {
    const checked = event.target.checked;
    const id = project_id;
    // const map = window.map_global;
    if (checked) {
      dispatch(setshowMeasuringsPanel(true));
      dispatch(addSelectedProjectId(id));
    } else {
      dispatch(setshowMeasuringsPanel(false));
      dispatch(removeSelectedProjectId(id));
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

          <MoreonProperty
            project_id={project.id}
            onClick={() => setOpenProperties(!openProperties)}
          />

          <ListItemText
            secondary={project.name}
            sx={{ opacity: open ? 1 : 0 }}
          />

          <Tooltip title="Show Measurings">
            <Checkbox
              onChange={(event) =>
                handleMeasuringsPanelChecked(event, project.id)
              }
              size="small"
              {...label}
              defaultChecked={false}
              sx={{
                color: pink[600],
                "&.Mui-checked": {
                  color: pink[600],
                },
              }}
            />
          </Tooltip>

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
