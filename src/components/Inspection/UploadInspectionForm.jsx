import { useEffect, useState, useRef } from "react";
import { Box, Button, Checkbox, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "./Dropzone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  resetFile,
  setFiles,
  setFilesChecked,
  setTypeofInspectionChecked,
} from "../../reducers/InspectionUpload";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { setshowUploadInspection } from "../../reducers/DisplaySettings";
import maplibregl, { FullscreenControl } from "maplibre-gl";

const UploadInspectionForm = ({ client_id, project_id }) => {
  const mapContainerPhotos = useRef();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const inspection_id = useSelector(
    (state) => state.inspectionUpload.inspection_id
  );
  const inspection = useSelector(
    (state) => state.inspection.inspectionData
  ).filter((inspection) => inspection.id === inspection_id)[0];

  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const files = useSelector((state) => state.inspectionUpload.files);

  const handleChangeType = (event, type) => {
    const id = type.id;
    dispatch(
      setTypeofInspectionChecked({ id: id, checked: event.target.checked })
    );
  };
  const handleChangePhoto = (event, file, index) => {
    const id = index;
    console.log(id, file.name);
    dispatch(setFilesChecked({ id: id, checked: event.target.checked }));
    if (event.target.checked) {
      // plot in the map logic
    } else {
      // remove from the map
    }
  };

  const handleUploadPhotos = (event) => {
    event.preventDefault();
    console.log(selectedDate);
    console.log(client_id, project_id);
  };

  useEffect(() => {
    return () => {
      dispatch(resetFile([]));
    };
  }, []);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerPhotos.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [103.8574, 2.2739],
      zoom: 10,
      attributionControl: false,
    });
    map.addControl(new FullscreenControl());
    // window.mapshapefile = map;

    return () => {
      map.remove();
    };
  }, []);
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          // zIndex: 9999,
        }}
      >
        <form
          onSubmit={handleUploadPhotos}
          style={{
            width: "80%",
            maxWidth: "800px",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
            height: "400px",
            margin: "120px auto",
            overflow: "auto",
          }}
        >
          <Grid container>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                      >
                        Name: {inspection?.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            defaultValue={dayjs(inspection?.date)}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            label="Pick a date "
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          flexGrow: 1,
                          backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                          height: "220px",
                        }}
                      >
                        <Box
                          sx={{
                            width: "200px",
                            overflow: "scroll",
                            flex: "1",
                          }}
                        >
                          <Typography
                            sx={{
                              marginLeft: 2,
                              marginTop: 2,
                            }}
                            variant="body2"
                            gutterBottom
                          >
                            Type of Inspection
                          </Typography>
                          <Grid container>
                            <Grid item container sx={12}>
                              {type_of_inspection.map((type) => (
                                <FormControlLabel
                                  sx={{ marginLeft: 1 }}
                                  key={type.id}
                                  slotProps={{
                                    typography: {
                                      fontSize: 12,
                                      color: "#6A6D70",
                                      fontWeight: 600,
                                    },
                                  }}
                                  label={type?.full_type}
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={type?.checked}
                                      onChange={(event) =>
                                        handleChangeType(event, type)
                                      }
                                    />
                                  }
                                />
                              ))}
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Box>
                    {/* <Box sx={{ height: "300px" }}>Map placement </Box> */}
                    <div
                      style={{ width: "100%", height: "350px" }}
                      ref={mapContainerPhotos}
                      // id="mapproperty"
                      // className="mapproperty"
                    ></div>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Paper
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                height: "350px",
                marginLeft: { xs: 0, md: "20px", lg: "20px" },
                marginTop: { xs: "20px", md: 0, lg: 0 },
              }}
            >
              <Box
                sx={{
                  overflow: "scroll",
                  flex: "1",
                }}
              >
                <Typography
                  sx={{
                    marginLeft: 2,
                    marginTop: 2,
                  }}
                  variant="body2"
                  gutterBottom
                >
                  Total Photos: {files.length}
                </Typography>
                <Grid container>
                  <Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
                    {files.length > 0 &&
                      files.map((file, index) => (
                        <FormControlLabel
                          sx={{ marginLeft: 1 }}
                          key={index}
                          slotProps={{
                            typography: {
                              fontSize: 12,
                              color: "#6A6D70",
                              fontWeight: 600,
                            },
                          }}
                          label={file?.name}
                          control={
                            <Checkbox
                              size="small"
                              checked={file?.checked}
                              onChange={(event) =>
                                handleChangePhoto(event, file, index)
                              }
                            />
                          }
                        />
                      ))}
                  </Grid>
                  {files.length == 0 && files ? (
                    <p style={{ marginLeft: "15px" }}>No photos yet</p>
                  ) : null}
                </Grid>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Dropzone />
              </Box>
            </Paper>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "center" },
              alignItems: "center",
              marginTop: { xs: "10px", md: "10px" },
            }}
          >
            <Button sx={{ margin: "5px" }} variant="contained" color="primary">
              Upload Photos
            </Button>
            <Button
              onClick={() => {
                dispatch(setshowUploadInspection(false));
              }}
              sx={{ margin: "5px" }}
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
};

export default UploadInspectionForm;

UploadInspectionForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
