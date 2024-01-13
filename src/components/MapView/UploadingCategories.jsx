import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Switch, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import CategoryTransfer from "./AutoCompleteMultiple";
import CategoryList from "./CategoriesList";
import { Box } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AutoCompleteMap from "../MapView/AutoCompleteMap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector } from "react-redux";

export default function UploadingCategories() {
  //   const [isFormOpen, setIsFormOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  //   const openForm = () => {
  //     setIsFormOpen(true);
  //   };

  const distinct = useSelector((state) => state.uploadMeasuring.distinct);

  const closeForm = () => {
    setLoaded(false);
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  return (
    <>
      {/* {isFormOpen && ( */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <form
          onSubmit={handleCreateProperty}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ padding: 2 }}>
                Select the Matched categories Measuring for Map Nov from the
                available classes from file{" "}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ maxHeight: "400px", overflow: "scroll" }}>
              {distinct &&
                distinct.map((layer, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 3,
                      alignItems: "center",
                    }}
                  >
                    <FormGroup sx={{ margin: 0, padding: 0 }}>
                      <FormControlLabel
                        key={index}
                        slotProps={{
                          typography: {
                            fontSize: 15,
                            color: "#6A6D70",
                            fontWeight: 900,
                          },
                        }}
                        control={
                          <Checkbox
                            // onChange={(event) =>
                            //   handleLayerChange(
                            //     event,
                            //     layer.layername,
                            //     layer.extent
                            //   )
                            // }
                            key={index}
                            size="small"
                            // defaultChecked
                            sx={{
                              "&:hover": { backgroundColor: "transparent" },
                            }}
                          />
                        }
                        label={layer.layername}
                        sx={{ margin: 0, padding: 0 }}
                      />
                    </FormGroup>
                    <ArrowForwardIosIcon />
                    <AutoCompleteMap
                      onItemSelected={(id) => setSelectedCategoryId(id)}
                      category={"category"}
                    />
                  </Box>
                ))}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  // sx={{ ml: "50%", mb: 0 }}
                  // fullWidth
                >
                  Done
                </Button>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  // sx={{ ml: "50%", mb: 0 }}
                  // fullWidth
                >
                  Close
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* )} */}
    </>
  );
}

UploadingCategories.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
  onProgressForm: PropTypes.func,
  onProgressValue: PropTypes.func,
  onSetRasters: PropTypes.func,
};

// import * as React from "react";
// import Popover from "@mui/material/Popover";
// import Button from "@mui/material/Button";
// import { Box, Tooltip } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";

// export default function UploadingCategories() {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDoneClick = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   return (
//     <div>
//       <Tooltip title="Show More">
//         <MoreVertIcon
//           onClick={handleClick}
//           sx={{ fontSize: 16, color: "#d51b60" }}
//         />
//       </Tooltip>
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//       >
//         <Box sx={{ backgroundColor: "black", color: "white", opacity: 0.8 }}>
//           <FormControlLabel
//             sx={{ margin: 0, marginRight: 1 }}
//             control={<Checkbox sx={{ color: "#d51b60" }} defaultChecked />}
//             label="Band Information"
//           />
//         </Box>
//         <Box sx={{ backgroundColor: "black", color: "white", opacity: 0.8 }}>
//           <FormControlLabel
//             sx={{ margin: 0, marginRight: 1 }}
//             control={<Checkbox sx={{ color: "#d51b60" }} defaultChecked />}
//             label="3D View"
//           />
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "black",
//             opacity: 0.8,
//           }}
//         >
//           <Button
//             // fullWidth
//             variant="contained"
//             color="primary"
//             onClick={handleDoneClick}
//             sx={{ margin: 1 }}
//           >
//             Upload Mesh
//           </Button>
//           <Button
//             //   fullWidth
//             onClick={handleDoneClick}
//             sx={{ margin: 1 }}
//             variant="contained"
//             color="primary"
//           >
//             Upload Point cloud
//           </Button>
//         </Box>
//       </Popover>
//     </div>
//   );
// }
