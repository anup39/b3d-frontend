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
  setShowMeasuringFileUploadPanel,
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
import { useTranslation } from "react-i18next";

export default function UploadingCategories() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const distinct = useSelector((state) => state.uploadMeasuring.distinct);
  const currentfile = useSelector((state) => state.uploadMeasuring.currentfile);
  const currentClient = useSelector(
    (state) => state.client.clientDetail.client_id
  );
  const currentProject = useSelector((state) => state.project.project_id);
  const currentUser = useSelector((state) => state.auth.user_id);
  const current_project_name = useSelector(
    (state) => state.project.current_project_name
  );

  const closeForm = () => {
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/delete-geojson/`, {
        filename: currentfile,
      })
      .then(() => {
        dispatch(setshowShapefileUpload(false));
        dispatch(setLayers([]));
        dispatch(setCurrentFile(null));

        dispatch(setshowUploadingCategories(false));
        dispatch(setdistinct([]));
      })
      .catch((error) => {
        console.log(error, "error");
        dispatch(setshowShapefileUpload(false));
        dispatch(setLayers([]));
        dispatch(setCurrentFile(null));
        dispatch(setshowUploadingCategories(false));
        dispatch(setdistinct([]));
      });
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    // const checkedCategories = distinct.filter((subArray) => {
    //   return subArray.filter((item) => item.checked).length > 0;
    // });
    console.log(distinct);
    const fileextension = currentfile.split(".").pop();
    let type_of_file = "Geojson";
    if (fileextension === "zip") {
      type_of_file = "Shapefile";
    } else if (fileextension === "geojson" || fileextension === "json") {
      type_of_file = "Geojson";
    }
    const data = new FormData();
    data.append("result", JSON.stringify(distinct));
    data.append("filename", currentfile);
    data.append("type_of_file", type_of_file);
    data.append("client_id", currentClient);
    data.append("project_id", currentProject);
    data.append("user_id", currentUser);
    console.log(data);
    if (distinct.length > 0) {
      // closeForm();
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
          dispatch(
            settoastMessage(
              "Successfully uploading categories. See the panel for more info"
            )
          );
          dispatch(settoastType("success"));
          dispatch(setshowUploadingCategories(false));
          dispatch(setShowMeasuringFileUploadPanel(true));

          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
        })
        .catch((error) => {
          // dispatch(setshowProgressFormOpen(false));
          dispatch(setshowMapLoader(false));
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Failed to upload the categories"));
          dispatch(settoastType("error"));
          console.error("Error fetching data:", error);
        });
    }
  };

  const handleLayerChange = (event, main_index, index) => {
    dispatch(
      changeDistinctChecked({
        main_index: main_index,
        index: index,
        checked: event.target.checked,
      })
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
          zIndex: 99999,
          borderRadius: "10px",
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
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {" "}
                <Typography sx={{ padding: 2 }}>
                  Select/Modify the matched categories for :
                </Typography>
                <Typography sx={{ color: "#093F7F" }}>
                  {current_project_name}.
                </Typography>
              </Box>
              <Box sx={{ marginLeft: 2 }}>
                <Typography sx={{ color: "red" }}>
                  Note : Here we use AI model to clean the data and detect the
                  categories.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ maxHeight: "400px", overflow: "scroll" }}>
              {distinct &&
                distinct.map((type_of_geometry, main_index) => (
                  <div key={main_index}>
                    {type_of_geometry.map((layer, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          // gap: 4,
                          marginBottom: 1,
                          alignItems: "center",
                          justifyContent: "space-between",
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
                                  handleLayerChange(event, main_index, index)
                                }
                                key={index}
                                size="small"
                                // defaultChecked
                                checked={layer.checked}
                                sx={{
                                  "&:hover": { backgroundColor: "transparent" },
                                }}
                              />
                            }
                            label={layer.cleaned_name}
                            sx={{ margin: 0, padding: 0 }}
                          />
                        </FormGroup>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <ArrowForwardIosIcon />

                          <AutoCompleteMap
                            key={index}
                            // onItemSelected={(id) => setSelectedCategoryId(id)}
                            index={index}
                            category={"category"}
                            main_index={main_index}
                            layer={layer}
                          />
                        </Box>
                      </Box>
                    ))}
                  </div>
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
                  {t("Save")}
                </Button>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  // sx={{ ml: "50%", mb: 0 }}
                  // fullWidth
                >
                  {t("Close")}
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
