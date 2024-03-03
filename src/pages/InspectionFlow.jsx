import { useState, useEffect, useRef } from "react";
import Appbar from "../components/Common/AppBar";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { Tooltip } from "@mui/material";
import img1 from "/Inspire2/DJI_0015_6_7.jpg";
import img2 from "/Inspire2/DJI_0024_5_6.jpg";
import img3 from "/Inspire2/DJI_0042_3_4.jpg";
import img4 from "/Inspire2/DJI_0066_7_8.jpg";
import ImageCarousel from "../components/Common/ImageCarousel";
import { setshowInspectionType } from "../reducers/DisplaySettings";
import InspectionTypeForm from "../components/InspectionFlow/InspectionTypeForm";
import { Stage, Layer, Rect } from "react-konva";
import URLImage from "../components/Common/URLImage";
import { FullscreenControl } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import { setImages, setSelected } from "../reducers/InspectionFlow";
import axios from "axios";
import { useParams } from "react-router-dom";

const InspectionFlow = () => {
  const { inspection_id } = useParams();
  const dispatch = useDispatch();
  const images = useSelector((state) => state.inspectionFlow.images);
  // const [selectedImage, setSelectedImage] = useState(
  //   images ? images[0].img : null
  // );
  console.log(images);
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const annotationsToDraw = [...annotations, ...newAnnotation];
  const [imageScale, setImageScale] = useState(1);
  const [draggable, setDraggable] = useState(true);
  const mapContainerPhotos = useRef(null);
  const [map, setMap] = useState(null);
  const showInspectionType = useSelector(
    (state) => state.displaySettings.showInspectionType
  );
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );

  const handleEvent = (event) => {
    dispatch(setshowInspectionType(true));
  };

  const handleMouseDown = (event) => {
    if (draggable) return;
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
    }
  };

  const handleMouseUp = (event) => {
    if (draggable) return;
    if (newAnnotation.length === 1) {
      const stage = event.target.getStage();
      const scale = stage.scaleX(); // assuming the x and y scales are the same
      const point = stage.getPointerPosition();
      const x = (point.x - stage.x()) / scale;
      const y = (point.y - stage.y()) / scale;
      // const stageTransform = stage.getAbsoluteTransform().copy();
      // const position = stageTransform.invert().point(point);

      const annotationToAdd = {
        x: newAnnotation[0].x,
        y: newAnnotation[0].y,
        width: x - newAnnotation[0].x,
        height: y - newAnnotation[0].y,
        key: annotations.length + 1,
      };
      setNewAnnotation([]);
      setAnnotations([...annotations, annotationToAdd]);
    }
  };

  const handleMouseMove = (event) => {
    if (draggable) return;
    if (newAnnotation.length === 1) {
      const stage = event.target.getStage();
      const scale = stage.scaleX(); // assuming the x and y scales are the same
      const point = stage.getPointerPosition();
      const x = (point.x - stage.x()) / scale;
      const y = (point.y - stage.y()) / scale;
      // const stageTransform = stage.getAbsoluteTransform().copy();
      // const position = stageTransform.invert().point(point);
      setNewAnnotation([
        {
          ...newAnnotation[0],
          width: x - newAnnotation[0].x,
          height: y - newAnnotation[0].y,
        },
      ]);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
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
    // Update the imageScale state variable
    setImageScale(newScale);
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleDraw = (event) => {
    setDraggable(false);
  };

  const handleRectClick = (value) => {
    console.log(value);
  };

  const handleSmallImageClick = (value) => {
    dispatch(setSelected({ selected: true, id: value.id }));
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
        dispatch(setImages(res.data));
      });
  }, [dispatch, inspection_id]);
  return (
    <>
      <Appbar />
      <div>
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
                <Tooltip title="Draw">
                  <IconButton onClick={(event) => handleDraw(event)}>
                    <CropSquareIcon
                      sx={{ "&:hover": { cursor: "pointer" }, color: "red" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Done">
                  <IconButton onClick={(event) => handleEvent(event)}>
                    <DoneIcon
                      sx={{ "&:hover": { cursor: "pointer" }, color: "red" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton>
                    <DeleteOutlineIcon
                      sx={{ "&:hover": { cursor: "pointer" }, color: "red" }}
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
          {/* {showInspectionType ? (
            <Box>
              <InspectionTypeForm />
            </Box>
          ) : null} */}

          <Grid item xs={12} md={8}>
            <Stage
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              width={window.innerWidth * 0.65}
              height={window.innerHeight * 0.6}
              draggable={draggable}
              onWheel={handleWheel}
            >
              <Layer name="image-layer">
                {images.length > 0 ? (
                  <URLImage
                    src={
                      images.find((image) => image.selected === true)?.photo ||
                      images[0].photo
                    }
                    width={window.innerWidth * 0.65}
                    height={window.innerHeight * 0.6}
                  />
                ) : null}
                {annotationsToDraw.map((value) => {
                  return (
                    <Rect
                      key={value.key}
                      x={value.x * imageScale}
                      y={value.y * imageScale}
                      width={value.width * imageScale}
                      height={value.height * imageScale}
                      fill="transparent"
                      stroke="black"
                      onClick={(value) => handleRectClick(value)}
                    />
                  );
                })}
              </Layer>
            </Stage>
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
