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
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { pink } from "@mui/material/colors";
import ShapefileUpload from "./ShapefileUpload";
import UploadingCategories from "./UploadingCategories";
import ReportPrint from "./ReportPrint";
import ProjectView from "./ProjectView";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import UploadPropertyForm from "../Property/UploadPropertyForm";
import UploadProgress from "../Property/UploadProgress";
import { useEffect } from "react";
import {
  setCurrentMapExtent,
  setCategoriesState,
  setcurrentTif,
} from "../../reducers/MapView";

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
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const clientDetail = useSelector((state) => state.mapView.clientDetail);

  console.log(clientDetail, "client Details");

  const showShapefileUpload = useSelector(
    (state) => state.mapView.showShapefileUpload
  );

  console.log(showShapefileUpload, "showShapefileUpload");
  const showUploadingCategories = useSelector(
    (state) => state.mapView.showUploadingCategories
  );

  console.log(showUploadingCategories, "showUploadingCategories");
  const showReport = useSelector((state) => state.mapView.showReport);
  const showMap = useSelector((state) => state.mapView.showMap);
  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );

  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const handleListView = () => {
    navigate(`/projects/${client_id}/List`);
  };

  useEffect(() => {
    dispatch(setCurrentMapExtent(null));
    dispatch(setCategoriesState(null));
    dispatch(setcurrentTif(null));
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      {showShapefileUpload ? <ShapefileUpload /> : null}

      {showUploadingCategories ? <UploadingCategories /> : null}

      {showTifUpload ? <UploadPropertyForm /> : null}
      {showProgressFormOpen ? <UploadProgress /> : null}

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
            <Avatar sx={{ bgcolor: pink[500], width: 25, height: 25, ml: 1 }}>
              {clientDetail ? clientDetail.client_image : ""}
            </Avatar>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                ml: 2,
                fontWeight: 700,
                color: "#027FFE",
                textDecoration: "none",
                fontSize: 12,
              }}
            >
              {/* Add a client Name here  */}
              {clientDetail ? clientDetail.client_name : ""}
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
        <List>
          {/* Properties */}
          {projects
            ? projects.map((project) => (
                <ProjectView key={project.id} project={project} />
              ))
            : null}
        </List>
      </Drawer>

      {showMap ? (
        <>
          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            <MapSection />
          </Box>
        </>
      ) : null}

      {showReport ? <ReportPrint /> : null}
    </Box>
  );
}

MapView.propTypes = {
  client_id: PropTypes.string,
  projects: PropTypes.array,
};
