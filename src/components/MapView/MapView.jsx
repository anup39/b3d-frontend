import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MapSection from "../../pages/MapSection";
import { Tooltip } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import Badge from "@mui/material/Badge";
import ProjectView from "./ProjectView";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MapView({ client_id, projects }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const handleListView = () => {
    navigate(`/projects/${client_id}/List`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        {/* Top part */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: { md: open ? "flex" : "none", sm: "none" },
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                ml: 2,
                fontWeight: 700,
                color: "#027FFE",
                textDecoration: "none",
                fontSize: 15,
              }}
            >
              Anup Properties
            </Typography>
            <Tooltip title="List View">
              <ListIcon
                onClick={handleListView}
                sx={{
                  display: {
                    xs: "none",
                    md: "flex",
                    "&:hover": { cursor: "pointer" },
                  },
                  ml: 3,
                }}
              ></ListIcon>
            </Tooltip>
          </Box>

          <DrawerHeader>
            <IconButton
              sx={{ transform: open ? "rotate(360deg)" : "rotate(180deg)" }}
              onClick={handleDrawerClose}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
        </Box>
        <Divider />

        {/* Main content */}
        {/* <Box
          sx={{
            paddingTop: 2,
            paddingLeft: 1,
            paddingRight: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Avatar
              sx={{ bgcolor: deepOrange[500], width: 25, height: 25, ml: 1 }}
            >
              A
            </Avatar>
            {open ? <Typography sx={{ ml: 2 }}>Anup Dahal </Typography> : null}
          </Box>
          {open ? (
            <Box>
              <Tooltip title="Open">
                <Badge
                  sx={{ "&:hover": { cursor: "pointer" } }}
                  badgeContent={4}
                  color="primary"
                >
                  <LocationCityIcon color="action" />
                </Badge>
              </Tooltip>
            </Box>
          ) : null}
        </Box> */}
        <List>
          {/* Properties */}

          {projects
            ? projects.map((project) => (
                <ProjectView key={project.id} project={project} />
              ))
            : null}

          {/* Maps */}
          {/* <ListItem disablePadding sx={{ display: "block", fontSize: 28 }}>
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
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Properties"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {openProperties ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProperties} timeout="auto" unmountOnExit>
              <List sx={{ fontSize: 2 }} component="div" disablePadding>
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((item) => (
                  <ListItemButton
                    key={item}
                    sx={{
                      pl: 4,
                      "&:hover": {
                        backgroundColor: "#F1F7FF",
                      },
                      fontSize: 6,
                    }}
                  >
                    <ListItemIcon sx={{ fontSize: 2 }}>
                      <MapsHomeWorkIcon />
                      <Typography sx={{ ml: 2, fontSize: 15 }}>
                        Property A
                      </Typography>
                    </ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem> */}
          {/* Measurings */}
          {/* <ListItem disablePadding sx={{ display: "block", fontSize: 28 }}>
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
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Properties"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {openProperties ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProperties} timeout="auto" unmountOnExit>
              <List sx={{ fontSize: 2 }} component="div" disablePadding>
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((item) => (
                  <ListItemButton
                    key={item}
                    sx={{
                      pl: 4,
                      "&:hover": {
                        backgroundColor: "#F1F7FF",
                      },
                      fontSize: 6,
                    }}
                  >
                    <ListItemIcon sx={{ fontSize: 2 }}>
                      <MapsHomeWorkIcon />
                      <Typography sx={{ ml: 2, fontSize: 15 }}>
                        Property A
                      </Typography>
                    </ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem> */}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <MapSection />
      </Box>
    </Box>
  );
}
