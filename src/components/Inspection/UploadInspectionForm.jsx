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
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { setshowUploadInspection } from "../../reducers/DisplaySettings";
import maplibregl, { FullscreenControl } from "maplibre-gl";
import axios from "axios";

const UploadInspectionForm = () => {
  const mapContainerPhotos = useRef();
  const dispatch = useDispatch();
  // const [selectedDate, setSelectedDate] = useState(null);
  const [files, setFileData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const inspection_id = useSelector(
    (state) => state.inspectionUpload.inspection_id
  );
  const user_id = useSelector((state) => state.auth.user_id);
  const inspection = useSelector(
    (state) => state.inspection.inspectionData
  ).filter((inspection) => inspection.id === inspection_id)[0];
  const [map, setMap] = useState(null);
  const handleFileData = (fileData) => {
    setFileData((prevFileData) => [...prevFileData, fileData]);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setFileData((prevFileData) => {
        const newFileData = [...prevFileData];
        newFileData.forEach((file, index) => {
          file.checked = event.target.checked;
          map.setPaintProperty(
            "point-" + index,
            "circle-color",
            event.target.checked ? "#ff0000" : "#007cbf"
          );
        });

        return newFileData;
      });
    } else {
      setFileData((prevFileData) => {
        const newFileData = [...prevFileData];
        newFileData.forEach((file, index) => {
          file.checked = event.target.checked;
          map.setPaintProperty(
            "point-" + index,
            "circle-color",
            event.target.checked ? "#ff0000" : "#007cbf"
          );
        });

        return newFileData;
      });
    }
    setSelectAll(event.target.checked);
  };

  const handleChangePhoto = (event, file, index) => {
    setFileData((prevFileData) => {
      const newFileData = [...prevFileData];
      newFileData[index] = {
        ...newFileData[index],
        checked: event.target.checked,
      };

      return newFileData;
    });

    if (event.target.checked) {
      map.setPaintProperty("point-" + index, "circle-color", "#ff0000");
      map.flyTo({
        center: [file.longitude, file.latitude],
        zoom: 21,
      });
    } else {
      map.setPaintProperty("point-" + index, "circle-color", "#007cbf");
    }
  };

  const handleUploadPhotos = (event) => {
    event.preventDefault();
    console.log("upload photos");
    files.map((file) => {
      if (file.checked) {
        const data = new FormData(event.currentTarget);
        data.append("inspection_report", inspection_id);
        data.append("photo", file.file);
        data.append("latitude", file.latitude);
        data.append("longitude", file.longitude);
        data.append("created_by", user_id);
        data.append("is_display", true);
        data.append("is_inspected", false);
        axios
          .post(
            `${import.meta.env.VITE_API_DASHBOARD_URL}/inspection-photo/`,
            data
          )
          .then(() => {
            dispatch(setshowUploadInspection(false));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    return () => {
      setFileData([]);
    };
  }, [dispatch]);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerPhotos.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [10.035153, 56.464267],
      zoom: 10,
      attributionControl: false,
    });
    setMap(map);
    map.addControl(new FullscreenControl());
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
                        {inspection?.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            defaultValue={dayjs(
                              JSON.parse(inspection?.date_of_inspection)
                            )}
                            // disabled={true}
                            // onChange={(newValue) => setSelectedDate(newValue)}
                            // label="Pick a date "
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Box>
                    <div
                      style={{ width: "100%", height: "350px" }}
                      ref={mapContainerPhotos}
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
                  Total Photos Uploaded: {files.length}
                </Typography>

                {files.length > 0 && (
                  <FormControlLabel
                    sx={{ marginLeft: 1 }}
                    slotProps={{
                      typography: {
                        fontSize: 12,
                        color: "red",
                        fontWeight: 600,
                      },
                    }}
                    label={"Select All"}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectAll}
                        onChange={(event) => handleSelectAll(event)}
                      />
                    }
                  />
                )}

                <Grid container>
                  <Grid item sx={{ display: "flex", flexDirection: "column" }}>
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
                    <p style={{ marginLeft: "20px", fontSize: 12 }}>
                      No photos yet.Please Upload
                    </p>
                  ) : null}
                </Grid>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Dropzone
                  handleFileData={handleFileData}
                  map={map}
                  files={files}
                />
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
            <Button
              type="submit"
              sx={{ margin: "5px" }}
              variant="contained"
              color="primary"
            >
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
