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
  const [rectangles, setRectangles] = useState([
    { x: 23, y: 23, width: 100, height: 100 },
  ]);
  // const [newRect, setNewRect] = useState(null);
  const [stage, setStage] = useState(null);
  const stafeRef = useRef(null);

  const handleSmallImageClick = (img) => {
    setSelectedImage(img);
  };
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );

  const handleEvent = (event) => {
    dispatch(setshowInspectionType(true));
  };
  const showInspectionType = useSelector(
    (state) => state.displaySettings.showInspectionType
  );

  const handleDraw = (event) => {
    stage.draggable(false);
    let newReact = null;
    stage.on("mousedown", (e) => {
      console.log(e, " mouse down");
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      newReact = { x: point.x, y: point.y, width: 0, height: 0 };
    });
    stage.on("mousemove", (e) => {
      console.log(e, " mouse move");
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      if (!newReact) return;
      newReact.width = point.x - newReact.x;
      newReact.height = point.y - newReact.y;
    });
    stage.on("mouseup", (e) => {
      console.log(e, " mouse up");
      setRectangles([...rectangles, newReact]);
      newReact = null;
    });
  };

  useEffect(() => {
    const imageObj = new window.Image();
    imageObj.src = selectedImage;

    imageObj.onload = () => {
      const stage = new Konva.Stage({
        container: stafeRef.current,
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
        // draggable: true,
      });

      setStage(stage);

      const layer = new Konva.Layer();
      stage.add(layer);

      stage.on("wheel", (e) => {
        e.evt.preventDefault();
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
          x:
            -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
            newScale,
          y:
            -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
            newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
      });
      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stage.width(),
        height: stage.height(),
      });

      layer.add(konvaImage);

      rectangles.map((rect) => {
        const konvaRect = new Konva.Rect({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          stroke: "red",
          strokeWidth: 2,
          draggable: true,
        });

        layer.add(konvaRect);
      });

      layer.draw();
    };
  }, [selectedImage, rectangles]);

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
              <div ref={stafeRef}></div>
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
