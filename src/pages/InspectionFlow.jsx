import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Appbar from "../components/Common/AppBar";
import {
  Box,
  Button,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { Tooltip } from "@mui/material";
import img1 from "/Inspire2/DJI_0015_6_7.jpg";
import img2 from "/Inspire2/DJI_0024_5_6.jpg";
import img3 from "/Inspire2/DJI_0042_3_4.jpg";
import img4 from "/Inspire2/DJI_0066_7_8.jpg";
import ImageCarousel from "../components/Common/ImageCarousel";

const itemData = [
  { img: img1, title: "Image 1" },
  { img: img2, title: "Image 2" },
  { img: img3, title: "Image 3" },
  { img: img4, title: "Image 4" },
];

const InspectionFlow = () => {
  const [selectedImage, setSelectedImage] = useState(itemData[0].img);

  const handleSmallImageClick = (img) => {
    setSelectedImage(img);
  };
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const { client_id, project_id, inspection_id } = useParams();

  return (
    <>
      <Appbar />
      <Grid container spacing={2} sx={{ margin: "4px" }}>
        <Grid item sx={{ display: "flex", alignItems: "center", gap: "180px" }}>
          <Typography>Lounkær Roof Inspection</Typography>
          <Grid>
            <Tooltip title="Draw">
              <IconButton>
                <CropSquareIcon
                  sx={{ "&:hover": { cursor: "pointer" }, color: "red" }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Done">
              <IconButton>
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
        </Grid>
        <Grid container spacing={2} sx={{ margin: "4px" }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: "70%", backgroundColor: "pink" }}>
              <img
                src={selectedImage}
                alt={selectedImage}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                backgroundColor: "#F1F7FF",
                height: "30%",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid item>
                <Box>
                  {/* <ImageList
                    sx={{ width: "100%", height: "30%", display: "flex" }}
                    gap={4}
                    cols={itemData.length}
                    rowHeight={164}
                  >
                    {itemData.map((item) => (
                      <Box
                        key={item.img}
                        sx={{ margin: "4px", cursor: "pointer" }}
                        onClick={() => handleSmallImageClick(item.img)}
                      >
                        <ImageListItem key={item.img}>
                          <img
                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=248&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      </Box>
                    ))}
                  </ImageList> */}
                  <ImageCarousel itemData={itemData} />
                </Box>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Box sx={{ height: "200px", backgroundColor: "lightgreen" }}>
                  image 3
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ height: "200px", backgroundColor: "lightcoral" }}>
                  image 4
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
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
                    sx={{ m: 1, width: "90%" }}
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
                    sx={{ m: 1, width: "90%" }}
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
                    sx={{ m: 1, width: "90%" }}
                    options={type_of_inspection.map((type) => type.type)}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField {...params} label="Type" variant="outlined" />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{ margin: "4px" }}
                  variant="contained"
                  color="error"
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default InspectionFlow;
