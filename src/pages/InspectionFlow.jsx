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
import Konva from "konva";

// testing

const itemData = [
  { img: img1, title: "Image 1" },
  { img: img2, title: "Image 2" },
  { img: img3, title: "Image 3" },
  { img: img4, title: "Image 4" },
];

const InspectionFlow = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(itemData[0].img);
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const stageRef = useRef(null);

  const handleSmallImageClick = (img) => {
    setSelectedImage(img);
  };
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const handleEvent = (event) => {
    console.log(event);
    console.log("Hello");
    dispatch(setshowInspectionType(true));
  };
  const showInspectionType = useSelector(
    (state) => state.displaySettings.showInspectionType
  );

  useEffect(() => {
    const handleMouseDown = (e) => {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setNewRect({ x: point.x, y: point.y, width: 0, height: 0 });
    };

    const handleMouseMove = (e) => {
      if (!newRect) return;

      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setNewRect({
        ...newRect,
        width: point.x - newRect.x,
        height: point.y - newRect.y,
      });
    };

    const handleMouseUp = () => {
      setRectangles([...rectangles, newRect]);
      setNewRect(null);
    };
    const imageObj = new window.Image();
    imageObj.src = selectedImage;

    imageObj.onload = () => {
      const stage = new Konva.Stage({
        container: "container",
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stage.width() / 2,
        height: stage.height() / 2,
      });

      layer.add(konvaImage);

      rectangles.map((rect) => {
        console.log(rect, "rect");
        const konvaRect = new Konva.Rect({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          stroke: "red",
          strokeWidth: 2,
          draggable: true,
          editable: true,
        });

        layer.add(konvaRect);
      });

      if (newRect) {
        const konvaRect = new Konva.Rect({
          x: newRect.x,
          y: newRect.y,
          width: newRect.width,
          height: newRect.height,
          stroke: "red",
          strokeWidth: 2,
        });

        layer.add(konvaRect);
      }

      layer.draw();

      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
      stage.on("mouseup", handleMouseUp);
    };
  }, [selectedImage, rectangles, newRect]);
  const handleZoomIn = () => {
    const oldScale = stageRef.current.scaleX();

    stageRef.current.scale({ x: oldScale + 0.1, y: oldScale + 0.1 });
    stageRef.current.batchDraw();
  };

  const handleZoomOut = () => {
    const oldScale = stageRef.current.scaleX();

    if (oldScale > 0.1) {
      stageRef.current.scale({ x: oldScale - 0.1, y: oldScale - 0.1 });
      stageRef.current.batchDraw();
    }
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
                  <IconButton>
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
          {showInspectionType ? (
            <Box>
              <InspectionTypeForm />
            </Box>
          ) : null}
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
              <div id="container"></div>
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
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
