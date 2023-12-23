import { useState } from "react";
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

const tifs = [
  { id: 1, name: "map nov" },
  { id: 2, name: "map dec" },
];

export default function ProjectView({ project }) {
  const [openProperties, setOpenProperties] = useState(true);
  return (
    <Box>
      <ListItem
        key={project.id}
        disablePadding
        sx={{ display: "block", fontSize: 28 }}
      >
        <ListItemButton
          onClick={() => setOpenProperties(!openProperties)}
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
          <MoreonProperty />

          <ListItemText
            secondary={project.name}
            sx={{ opacity: open ? 1 : 0 }}
          />

          {openProperties ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProperties} timeout="auto" unmountOnExit>
          <List sx={{ fontSize: 2 }} component="div" disablePadding>
            {tifs
              ? tifs.map((tif) => <TiffMapView key={tif.id} tif={tif} />)
              : null}
          </List>
        </Collapse>
      </ListItem>
    </Box>
  );
}
