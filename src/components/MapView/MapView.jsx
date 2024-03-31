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
import MapSection from "./MapSection";
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
import { useState, useEffect, useRef } from "react";
import {
  setCurrentMapExtent,
  setCurrentMeasuringCategories,
  setcurrentTif,
} from "../../reducers/MapView";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import {
  setshowMeasuringsPanel,
  setshowTableMeasurings,
  setshowPiechart,
  setshowReport,
  setshowTifPanel,
  setOpenSidebar,
} from "../../reducers/MapView";

import {
  setcurrentProject,
  setcurrentProjectName,
} from "../../reducers/Project";

import Checkbox from "@mui/material/Checkbox";
import AutoCompleteProperties from "./AutoCompleteProperties";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import maplibregl from "maplibre-gl";

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

export default function MapView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const popUpRef = useRef(new maplibregl.Popup({ closeOnClick: false }));
  const projects = useSelector((state) => state.project.projects);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const clientDetail = useSelector((state) => state.client.clientDetail);
  const {
    level,
    openSidebar,
    showReport,
    showMap,
    showShapefileUpload,
    showUploadingCategories,
  } = useSelector((state) => state.mapView);

  const { current_measuring_categories, current_tif } = useSelector(
    (state) => state.mapView.currentMapDetail
  );

  const project_id = useSelector((state) => state.project.project_id);

  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );

  const handleDrawerClose = () => {
    console.log(!openSidebar);
    dispatch(setOpenSidebar(!openSidebar));
  };

  const handleListView = () => {
    navigate(`/projects/${client_id}/List`);
  };

  // useEffect(() => {
  //   dispatch(setCurrentMapExtent(null));
  //   dispatch(setCurrentMeasuringCategories(null));
  //   dispatch(setcurrentTif(null));
  // }, [dispatch]);

  // This is the logic or function for All measurements clicked
  // const handleMeasuringsPanelChecked = (event, project_id) => {
  //   console.log("All measurements clicked");
  //   const checked = event.target.checked;
  //   if (checked) {
  //     dispatch(setCurrentMeasuringCategories(null));
  //     dispatch(setshowMeasuringsPanel(true));
  //     // dispatch(addSelectedProjectId(id));
  //     dispatch(setcurrentProjectName("All"));
  //     dispatch(setcurrentProject(project_id));
  //   } else {
  //     dispatch(setCurrentMeasuringCategories(null));
  //     dispatch(setshowMeasuringsPanel(false));
  //     // dispatch(removeSelectedProjectId(id));
  //     dispatch(setcurrentProjectName(null));
  //     dispatch(setcurrentProject(null));
  //     dispatch(setCurrentMeasuringCategories(null));
  //     dispatch(setcurrentTif(null));
  //     dispatch(setshowTableMeasurings(false));
  //     dispatch(setshowPiechart(false));
  //     dispatch(setshowReport(false));
  //     dispatch(setshowTifPanel(false));

  //     const map = window.map_global;

  //     const measuringcategories = current_measuring_categories;
  //     if (measuringcategories) {
  //       measuringcategories?.forEach((measuringcategory) => {
  //         measuringcategory?.sub_category?.forEach((sub_category) => {
  //           sub_category?.category?.forEach((cat) => {
  //             if (cat.checked) {
  //               if (cat.type_of_geometry) {
  //                 const sourceId = String(client_id) + cat.view_name + "source";
  //                 const layerId = String(client_id) + cat.view_name + "layer";
  //                 if (map) {
  //                   RemoveSourceAndLayerFromMap({ map, sourceId, layerId });
  //                 }
  //               }
  //             }
  //           });
  //         });
  //       });
  //     }
  //     if (current_tif) {
  //       const id = current_tif.id;
  //       const style = map.getStyle();
  //       const existingLayer = style?.layers?.find(
  //         (layer) => layer.id === `${id}-layer`
  //       );
  //       const existingSource = style?.sources[`${id}-source`];
  //       if (existingLayer) {
  //         map.off("click", `${id}-layer`);
  //         map.removeLayer(`${id}-layer`);
  //       }
  //       if (existingSource) {
  //         map.removeSource(`${id}-source`);
  //       }
  //     }
  //   }
  // };

  return (
    <Box sx={{ display: "flex" }}>
      {showShapefileUpload ? <ShapefileUpload /> : null}

      {showUploadingCategories ? <UploadingCategories /> : null}

      {showTifUpload ? <UploadPropertyForm /> : null}
      {showProgressFormOpen ? <UploadProgress /> : null}

      <CssBaseline />
      <Drawer variant="permanent" open={openSidebar}>
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
              display: { md: openSidebar ? "flex" : "none", sm: "none" },
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
              sx={{
                transform: openSidebar ? "rotate(360deg)" : "rotate(180deg)",
              }}
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
        <Divider sx={{ mt: 0.1 }} />

        <List>
          {/* Properties */}

          {level === "Projects" && openSidebar ? (
            <ListItem disablePadding sx={{ display: "block", fontSize: 14 }}>
              <ListItemButton
                sx={{
                  // minHeight: 48,
                  justifyContent: openSidebar ? "initial" : "center",
                  py: 0,
                  "&:hover": {
                    backgroundColor: "#F1F7FF",
                  },
                }}
              >
                {/* #Ui for all the measurements */}
                <ListItemText
                  secondary={"All Measurements"}
                  // sx={{ opacity: openSidebar ? 1 : 0, ml: 0.7 }}
                  // secondaryTypographyProps={{ fontSize: 12 }}
                />

                <Tooltip title="Show All Measurings">
                  <Checkbox
                    // onChange={(event) =>
                    //   handleMeasuringsPanelChecked(event, "All")
                    // }
                    // size="small"
                    // {...label}
                    // defaultChecked={false}
                    checked={project_id === "All" ? true : false}
                    sx={{
                      display: openSidebar ? "block" : "none",
                      // mr: 5,
                      color: pink[600],
                      "&.Mui-checked": {
                        color: pink[600],
                      },
                    }}
                  />
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ) : null}

          {level === "Projects" ? <Divider /> : null}

          {/* Search functionality for the properties  */}

          {level === "Projects" && openSidebar ? (
            <AutoCompleteProperties />
          ) : null}

          {projects && openSidebar
            ? projects.map((project) => (
                <ProjectView
                  key={project.id}
                  project={project}
                  popUpRef={popUpRef}
                />
              ))
            : null}
        </List>
      </Drawer>

      {showMap ? (
        <>
          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            <MapSection popUpRef={popUpRef} />
          </Box>
        </>
      ) : null}

      {showReport ? <ReportPrint /> : null}
    </Box>
  );
}

MapView.propTypes = {};
