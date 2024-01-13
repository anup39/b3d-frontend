import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AutoCompleteMap from "../MapView/AutoCompleteMap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";
import {
  setshowShapefileUpload,
  setshowUploadingCategories,
} from "../../reducers/MapView";
import {
  setCurrentFile,
  setLayers,
  setdistinct,
} from "../../reducers/UploadMeasuring";

export default function UploadingCategories() {
  const dispatch = useDispatch();
  const distinct = useSelector((state) => state.uploadMeasuring.distinct);
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // console.log(selectedCategoryId, "selectedCategoryId");

  const closeForm = () => {
    dispatch(setshowShapefileUpload(false));
    dispatch(setLayers([]));
    dispatch(setCurrentFile(null));
    dispatch(setdistinct([]));
    dispatch(setshowUploadingCategories(false));
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
  };

  const handleLayerChange = (event, layer) => {
    if (event.target.checked) {
      // dispatch(setLayers([...layers, layer]));
      dispatch(setdistinct([...distinct, layer]));
    } else {
      // dispatch(setLayers(layers.filter((item) => item.id !== layer.id)));
      dispatch(setdistinct(distinct.filter((item) => item.id !== layer.id)));
    }
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
                            onChange={(event) =>
                              handleLayerChange(event, layer)
                            }
                            key={index}
                            size="small"
                            // defaultChecked
                            sx={{
                              "&:hover": { backgroundColor: "transparent" },
                            }}
                          />
                        }
                        label={layer.name + `(${layer.type_of_geometry})`}
                        sx={{ margin: 0, padding: 0 }}
                      />
                    </FormGroup>
                    <ArrowForwardIosIcon />
                    <AutoCompleteMap
                      key={index}
                      // onItemSelected={(id) => setSelectedCategoryId(id)}
                      category={"category"}
                      layer={layer}
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
