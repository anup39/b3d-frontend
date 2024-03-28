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
  setshowMapLoader,
  setshowShapefileUpload,
  setshowUploadingCategories,
} from "../../reducers/MapView";
import {
  changeDistinctChecked,
  setCurrentFile,
  setLayers,
  setdistinct,
} from "../../reducers/UploadMeasuring";
import axios from "axios";
// import { setProgress, setshowProgressFormOpen } from "../../reducers/Property";
import {
  setshowToast,
  settoastType,
  settoastMessage,
} from "../../reducers/DisplaySettings";

export default function UploadingCategories() {
  const dispatch = useDispatch();
  const distinct = useSelector((state) => state.uploadMeasuring.distinct);
  const currentfile = useSelector((state) => state.uploadMeasuring.currentfile);
  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const currentProject = useSelector(
    (state) => state.mapView.currentMapDetail.project_id
  );
  const currentUser = useSelector((state) => state.auth.user_id);

  const closeForm = () => {
    dispatch(setshowShapefileUpload(false));
    dispatch(setLayers([]));
    dispatch(setCurrentFile(null));
    dispatch(setdistinct([]));
    dispatch(setshowUploadingCategories(false));
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    const checkedCategories = distinct.filter((item) => item.checked);
    console.log(checkedCategories);
    const fileextension = currentfile.split(".").pop();
    let type_of_file = "Geojson";
    if (fileextension === "zip") {
      type_of_file = "Shapefile";
    } else if (fileextension === "geojson" || fileextension === "json") {
      type_of_file = "Geojson";
    }
    const data = new FormData();
    data.append("result", JSON.stringify(checkedCategories));
    data.append("filename", currentfile);
    data.append("type_of_file", type_of_file);
    data.append("client_id", currentClient);
    data.append("project_id", currentProject);
    data.append("user_id", currentUser);
    console.log(data);
    if (checkedCategories.length > 0) {
      closeForm();
      dispatch(setshowMapLoader(true));
      // dispatch(setshowProgressFormOpen(true));
      axios
        .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/save-upload/`, data, {
          // onUploadProgress: (progressEvent) => {
          //   const percentCompleted = Math.round(
          //     (progressEvent.loaded * 100) / progressEvent.total
          //   );
          //   dispatch(setProgress(percentCompleted));
          // },
        })
        .then((response) => {
          console.log(response);
          // dispatch(setshowProgressFormOpen(false));
          // dispatch(setProgress(0));
          dispatch(setshowMapLoader(false));
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Successfully Created Categories"));
          dispatch(settoastType("success"));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => {
          // dispatch(setshowProgressFormOpen(false));
          dispatch(setshowMapLoader(false));
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Failed Created Categories"));
          dispatch(settoastType("error"));
          console.error("Error fetching data:", error);
        });
    }
  };

  const handleLayerChange = (event, layer) => {
    dispatch(
      changeDistinctChecked({ id: layer.id, checked: event.target.checked })
    );
  };
  return (
    <>
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
                  type="submit"
                  // onClick={closeForm}
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
