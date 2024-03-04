import { useState, useEffect, useRef } from "react";
import Appbar from "../components/Common/AppBar";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MouseIcon from "@mui/icons-material/Mouse";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { Tooltip } from "@mui/material";
import ImageCarousel from "../components/Common/ImageCarousel";
import { Stage, Layer } from "react-konva";
import URLImage from "../components/Common/URLImage";
import { FullscreenControl } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import { setImages, setSelected } from "../reducers/InspectionFlow";
import axios from "axios";
import { useParams } from "react-router-dom";
import Rectangle from "../components/InspectionFlow/Rectangle";
import RectTransformer from "../components/InspectionFlow/RectangleTransformer";
import "./InspectionFlow.css";
import { Html } from "react-konva-utils";

function getRelativePointerPosition(node) {
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();
  const pos = node.getStage().getPointerPosition();
  return transform.point(pos);
}

const InspectionFlow = () => {
  const { inspection_id } = useParams();
  const dispatch = useDispatch();
  const images = useSelector((state) => state.inspectionFlow.images);
  const [draggable, setDraggable] = useState(true);
  const mapContainerPhotos = useRef(null);
  const [map, setMap] = useState(null);
  const [mouseState, setMouseState] = useState(true);
  const [drawState, setDrawState] = useState(false);

  // for the konva states
  const stageRef = useRef();
  const [rectangles, setRectangles] = useState([]);
  const [rectCount, setRectCount] = useState(0);

  const [selectedShapeName, setSelectedShapeName] = useState("");
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDraw, setMouseDraw] = useState(false);
  const [newRectX, setNewRectX] = useState(0);
  const [newRectY, setNewRectY] = useState(0);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );

  const handleMouseDown = (event) => {
    if (draggable) return;
    if (event.target.className === "Image") {
      const stage = event.target.getStage();
      const mousePos = getRelativePointerPosition(stage);
      setMouseDown(true);
      setNewRectX(mousePos.x);
      setNewRectY(mousePos.y);
      setSelectedShapeName("");
      return;
    }
    const clickedOnTransformer =
      event.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }
    const name = event.target.name();
    const rect = rectangles.find((r) => r.name === name);
    if (rect) {
      setSelectedShapeName(name);
    } else {
      setSelectedShapeName("");
    }
  };

  const handleMouseUp = () => {
    if (draggable) return;
    if (mouseDraw) {
      setRectCount(rectCount + 1);
      setMouseDraw(false);
    }
    setMouseDown(false);
  };

  const handleMouseMove = (event) => {
    if (draggable) return;
    const stage = event.target.getStage();
    const mousePos = getRelativePointerPosition(stage);
    if (!rectangles[rectCount]) {
      let newRect = {
        x: newRectX,
        y: newRectY,
        width: mousePos.x - newRectX,
        height: mousePos.y - newRectY,
        name: `rect${rectCount + 1}`,
        stroke: "red",
        key: String(Math.random()),
        draggable: false,
      };
      setMouseDraw(true);
      setRectangles([...rectangles, newRect]);
      return;
    }

    let updatedRect = {
      ...rectangles[rectCount],
      width: mousePos.x - newRectX,
      height: mousePos.y - newRectY,
    };

    let newRects = [
      ...rectangles.slice(0, rectCount),
      (rectangles[rectCount] = updatedRect),
      ...rectangles.slice(rectCount + 1),
    ];

    return setRectangles(newRects);
  };

  const _onRectChange = (index, newProps) => {
    let updatedRect = {
      ...rectangles[index],
      ...newProps,
    };
    let newRects = [
      ...rectangles.slice(0, index),
      (rectangles[index] = updatedRect),
      ...rectangles.slice(index + 1),
    ];

    setRectangles(newRects);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const initialScale = 1; // replace with your initial scale
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };
    let newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
    if (newScale < initialScale) {
      newScale = initialScale;
    }
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleMouse = () => {
    document.getElementById("stageContainer").style.cursor = "pointer";
    setMouseState(true);
    setDrawState(false);
    setDraggable(true);
  };

  const handleDraw = () => {
    document.getElementById("stageContainer").style.cursor = "crosshair";
    setDrawState(true);
    setMouseState(false);
    setDraggable(false);
  };

  const OnDoubleClick = (event) => {
    console.log("double click");
  };

  const handleRightClick = (e) => {
    e.evt.preventDefault();
    const menuNode = document.getElementById("menu");
    menuNode.style.display = "block";
    const stage = e.target.getStage();
    const containerRect = stage.container().getBoundingClientRect();
    menuNode.style.top =
      containerRect.top + stage.getPointerPosition().y + 4 + "px";
    menuNode.style.left =
      containerRect.left + stage.getPointerPosition().x + 4 + "px";
  };

  const handlePulseButton = () => {
    console.log("pulse button");
  };

  const handleSmallImageClick = (value) => {
    dispatch(setSelected({ selected: true, id: value.id }));

    images.forEach((image) => {
      const layerId = `point-${image.id}`;

      if (map.getLayer(layerId)) {
        map.setPaintProperty(
          layerId,
          "circle-color",
          image.id === value.id ? "red" : "blue"
        );

        if (image.id === value.id) {
          map.flyTo({ center: [image.longitude, image.latitude], zoom: 22 });
        }
      }
    });
  };
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerPhotos.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [10.035153, 56.464267],
      zoom: 10,
      attributionControl: false,
    });
    setMap(map);
    map.addControl(new FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-photo/?inspection_report=${inspection_id}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          res.data[0].selected = true;
        }
        dispatch(setImages(res.data));
        res.data.forEach((image) => {
          const layerId = `point-${image.id}`;

          if (map && map.getLayer(layerId) === undefined) {
            map.addLayer({
              id: layerId,
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [image.longitude, image.latitude],
                  },
                },
              },
              paint: {
                "circle-radius": 10,
                "circle-color": image.selected ? "red" : "blue",
              },
            });
          }
          if (map && image.selected) {
            map.flyTo({
              center: [image.longitude, image.latitude],
              zoom: 22,
            });
          }
        });
      });
  }, [dispatch, inspection_id, map]);

  useEffect(() => {
    const menuNode = document.getElementById("menu");
    window.addEventListener("click", () => {
      // hide menu
      menuNode.style.display = "none";
    });
    return () => {
      window.removeEventListener("click", () => {
        // hide menu
        menuNode.style.display = "none";
      });
    };
  }, []);

  return (
    <>
      <Appbar />
      <div>
        {contextMenu.visible && (
          <div
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            {/* Your context menu items go here */}
          </div>
        )}
        <Grid
          container
          spacing={2}
          sx={{
            paddingLeft: 1,
            paddingRight: 1,
            paddingTop: 2,
            paddingBottom: 1,
          }}
        >
          <Grid
            item
            sx={{
              padding: "0px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "200px",
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Lounkær Roof Inspection
              </Typography>
              <Grid sx={{ whiteSpace: "nowrap", boxShadow: 1 }}>
                <Tooltip title="Mouse">
                  <IconButton onClick={(event) => handleMouse(event)}>
                    <MouseIcon
                      sx={{
                        "&:hover": { cursor: "pointer" },
                        color: mouseState ? "blue" : "red",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Draw">
                  <IconButton onClick={(event) => handleDraw(event)}>
                    <CropSquareIcon
                      sx={{
                        "&:hover": { cursor: "pointer" },
                        color: drawState ? "blue" : "red",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Button variant="contained" color="error">
                Report
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid
              item
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
              }}
            >
              <Button variant="contained" color="error">
                Report
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <div style={{ display: "none" }} id="menu">
              <div>
                <button onClick={handlePulseButton} id="pulse-button">
                  Pulse
                </button>
                <button id="delete-button">Delete</button>
              </div>
            </div>
            <div id="stageContainer">
              <Stage
                ref={stageRef}
                container={"stageContainer"}
                width={window.innerWidth * 0.65}
                height={window.innerHeight * 0.6}
                draggable={draggable}
                onMouseDown={handleMouseDown}
                onMouseUp={mouseDown && handleMouseUp}
                onMouseMove={mouseDown && handleMouseMove}
                onTouchStart={handleMouseDown}
                onTouchEnd={mouseDown && handleMouseUp}
                onTouchMove={mouseDown && handleMouseMove}
                onDblClick={OnDoubleClick}
                onWheel={handleWheel}
              >
                <Layer>
                  {images.length > 0 ? (
                    <URLImage
                      src={
                        images.find((image) => image.selected === true)
                          ?.photo || images[0].photo
                      }
                      width={window.innerWidth * 0.65}
                      height={window.innerHeight * 0.6}
                    />
                  ) : null}
                  {rectangles.map(
                    (rect, i) => (
                      console.log(rect, "rect"),
                      (
                        <Rectangle
                          key={i}
                          {...rect}
                          mouseState={mouseState}
                          onTransform={(newProps) => {
                            _onRectChange(i, newProps);
                          }}
                          // onClick={handleRightClick}
                          onContextMenu={handleRightClick}
                        />
                      )
                    )
                  )}
                  {/* <RectTransformer selectedShapeName={selectedShapeName} /> */}
                </Layer>
              </Stage>
            </div>
            <Box
              sx={{
                width: { xs: "95%", md: "99%", lg: "99%" },
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#F1F7FF",
                // height: { xs: "30%", md: "25%", lg: "25%" },
                marginTop: "8px",
                // paddingTop: { sx: "0", md: "15px", large: "15px" },
                overflow: "hidden",
              }}
            >
              <Grid
                item
                sx={{
                  transform: {
                    xs: `scale(0.4)`,
                    sm: `scale(0.75)`,
                    md: `scale(0.75)`,
                    lg: `scale(0.9)`,
                    xl: `scale(1.0)`,
                  },
                }}
              >
                <Box>
                  <ImageCarousel
                    itemData={images}
                    onImageClick={handleSmallImageClick}
                  />
                </Box>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid item>
              <Box
                sx={{
                  width: { xs: "95%", md: "98%", lg: "98%" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Autocomplete
                  sx={{ mb: 0.5, width: "100%" }}
                  multiple
                  options={type_of_inspection.map((type) => type.standard_type)}
                  getOptionLabel={(option) => option}
                  // disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Standard Inspection"
                      variant="outlined"
                    />
                  )}
                />

                <Autocomplete
                  sx={{ mb: 0.5, width: "100%" }}
                  multiple
                  options={type_of_inspection.map((type) => type.sub_type)}
                  getOptionLabel={(option) => option}
                  // disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub Inspection"
                      variant="outlined"
                    />
                  )}
                />

                <Autocomplete
                  multiple
                  sx={{ mb: 0.5, width: "100%" }}
                  options={type_of_inspection.map((type) => type.type)}
                  getOptionLabel={(option) => option}
                  // disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Inspection"
                      variant="outlined"
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid container direction={{ xs: "row", md: "column" }} spacing={2}>
              <Grid item xs={6} md={12}>
                {images.length > 0 ? (
                  <Box>
                    <img
                      src={
                        (images.length > 0 &&
                          images.find((image) => image.selected === true)
                            ?.photo) ||
                        images[0].photo
                      }
                      style={{
                        width: "32vw",
                        height: "30vh",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ) : null}
              </Grid>
              <Grid item xs={6} md={12}>
                <Box>
                  <div
                    ref={mapContainerPhotos}
                    style={{
                      width: "32vw",
                      height: "30vh",
                    }}
                  ></div>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default InspectionFlow;
