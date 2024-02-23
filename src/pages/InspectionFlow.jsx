import { useState, useEffect } from "react";
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

const itemData = [
  { img: img1, title: "Image 1" },
  { img: img2, title: "Image 2" },
  { img: img3, title: "Image 3" },
  { img: img4, title: "Image 4" },
];

const InspectionFlow = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(itemData[0].img);
  const [lines, setLines] = useState([]);

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

  const handleMouseDown = () => {
    setLines([...lines, []]);
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  useEffect(() => {
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
        width: stage.width(),
        height: stage.height(),
      });

      layer.add(konvaImage);

      lines.map((line) => {
        const konvaLine = new Konva.Rect({
          points: line,
          stroke: "red",
          strokeWidth: 5,
          lineCap: "round",
          lineJoin: "round",
          draggable: true,
        });

        layer.add(konvaLine);
      });

      layer.draw();

      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
    };
  }, [selectedImage, lines]);

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
