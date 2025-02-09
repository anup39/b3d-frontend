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
import {
  setImages,
  setSelected,
  setStandardInspection,
  setSubInspection,
  setInspection,
} from "../reducers/InspectionFlow";
import axios from "axios";
import { useParams } from "react-router-dom";
import Rectangle from "../components/InspectionFlow/Rectangle";
import RectTransformer from "../components/InspectionFlow/RectangleTransformer";
import "./InspectionFlow.css";
import InspectionGeometryForm from "../components/InspectionFlow/InspectionGeometryForm";
import { Rect } from "react-konva";
import { useNavigate } from "react-router-dom";

function getRelativePointerPosition(node) {
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();
  const pos = node.getStage().getPointerPosition();
  return transform.point(pos);
}

const InspectionFlow = () => {
  const { client_id, project_id, inspection_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inspectionName, setInspectionName] = useState("");
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
  const [editModeGeom, setEditModeGeom] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDraw, setMouseDraw] = useState(false);
  const [newRectX, setNewRectX] = useState(0);
  const [newRectY, setNewRectY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [selectedStandardInspection, setSelectedStandardInspection] =
    useState(null);
  const [selectedSubInspection, setSelectedSubInspection] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedCost, setSelectedCost] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [created, setCreated] = useState(true);
  const [loaderSave, setLoaderSave] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [extent, setExtent] = useState({
    x: 0,
    y: 0,
    width: window.innerWidth * 0.32,
    height: window.innerHeight * 0.32,
    scaleX: 1,
    scaleY: 1,
  });

  const [
    selectedStandardInspectionFilter,
    setSelectedStandardInspectionFilter,
  ] = useState(null);
  const [selectedSubInspectionFilter, setSelectedSubInspectionFilter] =
    useState(null);
  const [selectedInspectionFilter, setSelectedInspectionFilter] =
    useState(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const standard_inspection = useSelector(
    (state) => state.inspectionFlow.standard_inspection
  );
  const sub_inspection = useSelector(
    (state) => state.inspectionFlow.sub_inspection
  );
  const inspection = useSelector((state) => state.inspectionFlow.inspection);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleMouseDown = (event) => {
    if (draggable) return;
    if (event.target.className === "Image") {
      const stage = event.target.getStage();
      const mousePos = getRelativePointerPosition(stage);
      setMouseDown(true);
      setNewRectX(mousePos.x);
      setNewRectY(mousePos.y);
      // setSelectedShapeName("");
      return;
    }
    const clickedOnTransformer =
      event.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }
    const name = event.target.name();
    const rect = rectangles.find((r) => r.name === name);
    // if (rect) {
    //   setSelectedShapeName(name);
    // } else {
    //   setSelectedShapeName("");
    // }
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
        id: rectangles[rectangles?.length - 1]?.id + 1 || 1,
        inspected_photo: inspection_id,
        description: "",
        caption: "",
        x: newRectX,
        y: newRectY,
        height: mousePos.y - newRectY,
        width: mousePos.x - newRectX,
        fill_color: "transparent",
        fil_opacity: 0,
        stroke_color: "#FF0000",
        stroke_width: 1,
        created: true,
        rotation: 0.0,
        standard_inspection: null,
        sub_inspection: null,
        inspection: null,
        severity: 0,
        cost: 0,
        created_by: user_id,
        is_display: true,
        key: rectCount + 1,
        draggable: false,
        name: `rect${rectangles[rectangles?.length - 1]?.id + 1 || 1}`,
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
    document.getElementById("menu").style.display = "none";
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
    setExtent({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      width: 200,
      height: 150,
      scaleX: newScale,
      scaleY: newScale,
    });
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

  const handleRightClick = (
    e,
    standard_inspection,
    sub_inspection,
    inspection,
    cost,
    id,
    created,
    x,
    y,
    height,
    width,
    name
  ) => {
    setSelectedStandardInspection(standard_inspection);
    setSelectedSubInspection(sub_inspection);
    setSelectedInspection(inspection);
    setSelectedCost(cost);
    setSelectedId(id);
    setCreated(created);
    setNewRectX(x);
    setNewRectY(y);
    setWidth(width);
    setHeight(height);
    setSelectedShapeName(name);
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

  const handleCreateGeometry = (event) => {
    event.preventDefault();

    let stroke_color = "#FF0000";
    let stroke_width = 1;
    setLoaderSave(true);
    if (created) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/inspection/${selectedInspection}/`
        )
        .then((res) => {
          console.log(res);
          stroke_color = res.data.stroke_color;
          stroke_width = res.data.stroke_width;
          const data = new FormData();
          data.append(
            "inspection_photo",
            images.find((image) => image.selected).id
          );
          data.append("description", "");
          data.append("caption", "");
          data.append("x", newRectX);
          data.append("y", newRectY);
          data.append("height", rectangles[rectCount - 1].height);
          data.append("width", rectangles[rectCount - 1].width);
          data.append("name", rectangles[rectCount - 1].name);
          // data.append("fill_color", "transparent");
          data.append("fill_opacity", 0);
          data.append("stroke_color", stroke_color);
          data.append("stroke_width", stroke_width);
          data.append("rotation", 0.0);
          data.append("standard_inspection", selectedStandardInspection);
          data.append("sub_inspection", selectedSubInspection);
          data.append("inspection", selectedInspection);
          data.append("severity", 0);
          data.append("cost", selectedCost);
          data.append("created_by", user_id);
          data.append("is_display", true);

          axios
            .post(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/inspection-photo-geometry/`,
              data
            )
            .then((res) => {
              console.log(res);
              axios
                .get(
                  `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/inspection-photo-geometry/?inspection_photo=${
                    images.find((image) => image.selected)?.id
                  }`
                )
                .then((res) => {
                  setRectangles(res.data);
                  setRectCount(res.data.length);
                  document.getElementById("menu").style.display = "none";
                  setLoaderSave(false);
                  setEditModeGeom(false);
                  setSelectedShapeName("");
                  axios
                    .patch(
                      `${
                        import.meta.env.VITE_API_DASHBOARD_URL
                      }/inspection-photo/${
                        images.find((image) => image.selected)?.id
                      }/`,
                      { is_inspected: true }
                    )
                    .then(
                      (res) => {
                        console.log(res);
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/inspection/${selectedInspection}/`
        )
        .then((res) => {
          stroke_color = res.data.stroke_color;
          stroke_width = res.data.stroke_width;
          const data = new FormData();
          data.append("x", newRectX);
          data.append("y", newRectY);
          data.append("height", height);
          data.append("width", width);
          // data.append("fill_color", "transparent");
          data.append("stroke_color", stroke_color);
          data.append("stroke_width", stroke_width);
          data.append("standard_inspection", selectedStandardInspection);
          data.append("sub_inspection", selectedSubInspection);
          data.append("inspection", selectedInspection);
          data.append("cost", selectedCost);
          data.append("created_by", user_id);

          axios
            .patch(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/inspection-photo-geometry/${selectedId}/`,
              data
            )
            .then(() => {
              axios
                .get(
                  `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/inspection-photo-geometry/?inspection_photo=${
                    images.find((image) => image.selected)?.id
                  }`
                )
                .then((res) => {
                  setRectangles(res.data);
                  setRectCount(res.data.length);
                  document.getElementById("menu").style.display = "none";
                  setLoaderSave(false);
                  setEditModeGeom(false);
                  setSelectedShapeName("");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteGeometry = () => {
    setLoaderDelete(true);
    if (!created) {
      axios
        .delete(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/inspection-photo-geometry/${selectedId}/`
        )
        .then(() => {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/inspection-photo-geometry/?inspection_photo=${
                images.find((image) => image.selected)?.id
              }`
            )
            .then((res) => {
              setRectangles(res.data);
              setRectCount(res.data.length);
              document.getElementById("menu").style.display = "none";
              setLoaderDelete(false);
              setEditModeGeom(false);
              setSelectedShapeName("");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const updatedRectangles = rectangles.filter(
        (rectangle) => rectangle.id !== selectedId
      );
      setRectangles(updatedRectangles);
      setRectCount(updatedRectangles.length);
      document.getElementById("menu").style.display = "none";
      setLoaderDelete(false);
      setEditModeGeom(false);
      setSelectedShapeName("");
    }
  };

  const handleEditGeometry = () => {
    console.log("Edit");
    setEditModeGeom(true);
    document.getElementById("menu").style.display = "none";
    const updatedRectangles = rectangles.map((rect) => {
      if (rect.name === selectedShapeName) {
        return { ...rect, draggable: true };
      }
      return rect;
    });

    setRectangles(updatedRectangles);
  };

  const handleSmallImageClick = (value) => {
    document.getElementById("menu").style.display = "none";
    dispatch(setSelected({ selected: true, id: value.id }));
    setExtent({
      x: 0,
      y: 0,
      width: window.innerWidth * 0.32,
      height: window.innerHeight * 0.32,
      scaleX: 1,
      scaleY: 1,
    });

    images.forEach((image) => {
      const layerId = `point-${image.id}`;

      if (map.getLayer(layerId)) {
        map.setPaintProperty(
          layerId,
          "circle-color",
          image.id === value.id ? "red" : "blue"
        );

        if (image.id === value.id) {
          map.flyTo({ center: [image.longitude, image.latitude], zoom: 17 });
        }
      }
    });
    stageRef.current.scale({ x: 1, y: 1 });
    stageRef.current.position({ x: 0, y: 0 });
    stageRef.current.draw();
  };

  const handleCloseMenu = () => {
    const menuNode = document.getElementById("menu");
    menuNode.style.display = "none";
    setEditModeGeom(false);
    setSelectedShapeName("");
    const updatedRectangles = rectangles.map((rect) => {
      if (rect.name === selectedShapeName) {
        return { ...rect, draggable: false };
      }
      return rect;
    });

    setRectangles(updatedRectangles);
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
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/standard-inspection/`)
      .then(
        (res) => {
          dispatch(setStandardInspection(res.data));
        },
        (error) => {
          console.log(error);
        }
      );
    axios.get(`${import.meta.env.VITE_API_DASHBOARD_URL}/sub-inspection/`).then(
      (res) => {
        dispatch(setSubInspection(res.data));
      },
      (error) => {
        console.log(error);
      }
    );
    axios.get(`${import.meta.env.VITE_API_DASHBOARD_URL}/inspection/`).then(
      (res) => {
        dispatch(setInspection(res.data));
      },
      (error) => {
        console.log(error);
      }
    );
  }, [dispatch]);

  useEffect(() => {
    if (images.length === 0) return;
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-photo-geometry/?inspection_photo=${
          images.find((image) => image.selected)?.id
        }`
      )
      .then((res) => {
        setRectangles(res.data);
        setRectCount(res.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [images]);

  useEffect(() => {
    {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/inspection-report/${inspection_id}/`
        )
        .then((res) => {
          setInspectionName(res.data.name);
        });
    }
  }, [inspection_id]);

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
                {inspectionName}
              </Typography>
              <Grid sx={{ whiteSpace: "nowrap", boxShadow: 1, padding: 0.5 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                </Box>

                <Typography sx={{ color: "red", fontSize: 12 }}>
                  Click right on your mouse to edit and save.
                </Typography>
              </Grid>

              <Button
                onClick={() => {
                  navigate(
                    `/projects/${client_id}/inspections/${project_id}/inspection/${inspection_id}/report`
                  );
                }}
                variant="contained"
                color="error"
              >
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
              <Button
                onClick={() => {
                  navigate(
                    `/projects/${client_id}/inspections/${project_id}/inspection/${inspection_id}/report`
                  );
                }}
                variant="contained"
                color="error"
              >
                Report
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <InspectionGeometryForm
              handleCreateGeometry={handleCreateGeometry}
              deleteGeometry={deleteGeometry}
              handleEditGeometry={handleEditGeometry}
              handleCloseMenu={handleCloseMenu}
              selectedStandardInspection={selectedStandardInspection}
              selectedSubInspection={selectedSubInspection}
              selectedInspection={selectedInspection}
              selectedCost={selectedCost}
              setSelectedCost={setSelectedCost}
              inspection={inspection}
              sub_inspection={sub_inspection}
              standard_inspection={standard_inspection}
              selectedId={selectedId}
              setSelectedStandardInspection={setSelectedStandardInspection}
              setSelectedSubInspection={setSelectedSubInspection}
              setSelectedInspection={setSelectedInspection}
              loaderSave={loaderSave}
              loaderDelete={loaderDelete}
            />

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

                  {rectangles.map((rect, i) => (
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
                  ))}
                  <RectTransformer
                    editModeGeom={editModeGeom}
                    selectedShapeName={selectedShapeName}
                  />
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
            <Button
              sx={{ mb: 1 }}
              onClick={() => {
                setSelectedStandardInspectionFilter(null);
                setSelectedSubInspectionFilter(null);
                setSelectedInspectionFilter(null);
                axios
                  .get(
                    `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/inspection-photo-geometry/?inspection_photo=${
                      images.find((image) => image.selected)?.id
                    }`
                  )
                  .then((res) => {
                    setRectangles(res.data);
                    setRectCount(res.data.length);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
              variant="contained"
            >
              Reset Filter
            </Button>
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
                  // multiple
                  options={standard_inspection}
                  getOptionLabel={(option) => option.name}
                  value={
                    standard_inspection.find(
                      (type) => type.id === selectedStandardInspectionFilter
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Standard Inspection"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, value) => {
                    setSelectedStandardInspectionFilter(
                      value ? value.id : null
                    );
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/inspection-photo-geometry/?inspection_photo=${
                          images.find((image) => image.selected)?.id
                        }&standard_inspection=${value.id}&sub_inspection=${
                          selectedSubInspectionFilter
                            ? selectedSubInspectionFilter
                            : ""
                        }&inspection=${
                          selectedInspectionFilter
                            ? selectedInspectionFilter
                            : ""
                        }`
                      )
                      .then((res) => {
                        setRectangles(res.data);
                        setRectCount(res.data.length);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                />

                <Autocomplete
                  sx={{ mb: 0.5, width: "100%" }}
                  // multiple
                  options={sub_inspection}
                  getOptionLabel={(option) => option.name}
                  value={
                    sub_inspection.find(
                      (type) => type.id === selectedSubInspectionFilter
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub Inspection"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, value) => {
                    setSelectedSubInspectionFilter(value ? value.id : null);
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/inspection-photo-geometry/?inspection_photo=${
                          images.find((image) => image.selected)?.id
                        }&standard_inspection=${
                          selectedStandardInspectionFilter
                            ? selectedStandardInspectionFilter
                            : ""
                        }&sub_inspection=${value.id}&inspection=${
                          selectedInspectionFilter
                            ? selectedInspectionFilter
                            : ""
                        }`
                      )
                      .then((res) => {
                        setRectangles(res.data);
                        setRectCount(res.data.length);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                />

                <Autocomplete
                  // multiple
                  sx={{ mb: 0.5, width: "100%" }}
                  options={inspection}
                  getOptionLabel={(option) => option.name}
                  value={
                    inspection.find(
                      (type) => type.id === selectedInspectionFilter
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Inspection"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, value) => {
                    setSelectedInspectionFilter(value ? value.id : null);
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/inspection-photo-geometry/?inspection_photo=${
                          images.find((image) => image.selected)?.id
                        }&standard_inspection=${
                          selectedStandardInspectionFilter
                            ? selectedStandardInspectionFilter
                            : ""
                        }&sub_inspection=${
                          selectedSubInspectionFilter
                            ? selectedSubInspectionFilter
                            : ""
                        }&inspection=${value.id}`
                      )
                      .then((res) => {
                        setRectangles(res.data);
                        setRectCount(res.data.length);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                />
              </Box>
            </Grid>
            <Grid container direction={{ xs: "row", md: "column" }} spacing={2}>
              <Grid item xs={6} md={12}>
                {images.length > 0 ? (
                  <Box>
                    {/* <img
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
                    /> */}
                    <Stage
                      width={window.innerWidth * 0.32}
                      height={window.innerHeight * 0.32}
                    >
                      <Layer>
                        {images.length > 0 ? (
                          <URLImage
                            src={
                              images.find((image) => image.selected === true)
                                ?.photo || images[0].photo
                            }
                            width={window.innerWidth * 0.32}
                            height={window.innerHeight * 0.32}
                          />
                        ) : null}

                        {rectangles.map((rect, i) => (
                          <Rect
                            x={(rect.x / 0.65) * 0.32}
                            y={(rect.y / 0.6) * 0.32}
                            width={(rect.width / 0.65) * 0.32}
                            height={(rect.height / 0.6) * 0.32}
                            scaleX={1}
                            scaleY={1}
                            fill={"transparent"}
                            stroke={rect.stroke_color}
                            strokeWidth={rect.stroke_width}
                            name={rect.name}
                            key={i}
                          />
                        ))}
                      </Layer>
                      {/* <Layer>
                        <Rect
                          // x={((extent.x / 0.65) * 0.32) / extent.scaleX}
                          // y={((extent.y / 0.6) * 0.32) / extent.scaleY}
                          x={((extent.x / 0.65) * 0.32) / extent.scaleX}
                          y={((extent.y / 0.6) * 0.32) / extent.scaleY}
                          width={extent.width}
                          height={extent.height}
                          scaleX={1}
                          scaleY={1}
                          fill={"transparent"}
                          stroke={"blue"}
                          stroke_width={1}
                        />
                      </Layer> */}
                    </Stage>
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
