import { useState } from "react";
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
import { Stage, Layer, Rect, Image } from "react-konva";
import useImage from "use-image";

// testing

const itemData = [
  { img: img1, title: "Image 1" },
  { img: img2, title: "Image 2" },
  { img: img3, title: "Image 3" },
  { img: img4, title: "Image 4" },
];

const InspectionFlow = () => {
  const dispatch = useDispatch();
  // const [selectedImage, setSelectedImage] = useState(itemData[0].img);
  const [selectedImage] = useImage(itemData[1].img);
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const annotationsToDraw = [...annotations, ...newAnnotation];
  const [draggable, setDraggable] = useState(true);
  const showInspectionType = useSelector(
    (state) => state.displaySettings.showInspectionType
  );
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );

  const handleSmallImageClick = (img) => {
    // setSelectedImage(img);
  };

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

  return (
    <>
      <Appbar />
      <div
        style={{
          margin: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              container
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: "30px", sm: "80px", md: "100px", lg: "180px" },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Lounkær Roof Inspection
              </Typography>
              <Grid sx={{ whiteSpace: "nowrap" }}>
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
          <Grid container spacing={2} sx={{ margin: "4px" }}>
            <Grid item xs={12} md={8}>
              {/* <Box
                sx={{
                  height: "70%",
                  width: { xs: "95%", md: "100%", lg: "100%" },
                  backgroundColor: "pink",
                }}
              >
                <img
                  src={selectedImage}
                  alt={selectedImage}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box> */}
              <Stage
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                width={900}
                height={400}
                draggable={draggable}
                onWheel={handleWheel}
              >
                <Layer>
                  {selectedImage && (
                    <Image width={900} height={400} image={selectedImage} />
                  )}
                  {annotationsToDraw.map((value) => {
                    return (
                      <Rect
                        key={value.key}
                        x={value.x}
                        y={value.y}
                        width={value.width}
                        height={value.height}
                        fill="transparent"
                        stroke="black"
                      />
                    );
                  })}
                </Layer>
                <Layer></Layer>
              </Stage>
              <Box
                sx={{
                  width: { xs: "95%", md: "100%", lg: "100%" },
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#F1F7FF",
                  height: { xs: "30%", md: "25%", lg: "25%" },
                  marginTop: "8px",
                  paddingTop: { sx: "0", md: "15px", large: "15px" },
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
                      itemData={itemData}
                      onImageClick={handleSmallImageClick}
                    />
                  </Box>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid
                container
                direction={{ xs: "row", md: "column" }}
                spacing={2}
              >
                <Grid item xs={6} md={12}>
                  <Box
                    sx={{
                      height: "200px",
                      backgroundColor: "lightgreen",
                      width: "100%",
                    }}
                  >
                    <img
                      src={img3}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={12}>
                  <Box
                    sx={{
                      height: "200px",
                      backgroundColor: "lightcoral",
                      width: { xs: "90%", md: "100%", lg: "100%" },
                    }}
                  >
                    <img
                      src={img2}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Box
                    sx={{
                      width: { xs: "95%", md: "100%", lg: "100%" },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      sx={{
                        marginLeft: 1,
                        marginTop: 1,
                        color: "#ED1C24",
                      }}
                      variant="body2"
                      gutterBottom
                    >
                      Filter
                    </Typography>
                    <Autocomplete
                      sx={{ m: 0.5, width: "100%" }}
                      multiple
                      options={type_of_inspection.map(
                        (type) => type.standard_type
                      )}
                      getOptionLabel={(option) => option}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Standard Type"
                          variant="outlined"
                        />
                      )}
                    />

                    <Autocomplete
                      sx={{ m: 0.5, width: "100%" }}
                      multiple
                      options={type_of_inspection.map((type) => type.sub_type)}
                      getOptionLabel={(option) => option}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sub Type"
                          variant="outlined"
                        />
                      )}
                    />

                    <Autocomplete
                      multiple
                      sx={{ m: 0.5, width: "100%" }}
                      options={type_of_inspection.map((type) => type.type)}
                      getOptionLabel={(option) => option}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type"
                          variant="outlined"
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: {
                      xs: "none",
                      sm: "none",
                      md: "flex",
                      lg: "flex",
                    },
                    justifyContent: "center",
                  }}
                >
                  <Button variant="contained" color="error">
                    Report
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default InspectionFlow;
