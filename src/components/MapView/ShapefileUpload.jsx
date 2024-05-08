import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import maplibregl, { FullscreenControl } from "maplibre-gl";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import InputShapefileUpload from "./InputShapefileUpload";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import {
  setshowMapLoader,
  setshowShapefileUpload,
  setshowUploadingCategories,
} from "../../reducers/MapView";
import {
  setCurrentFile,
  setLayers,
  setdistinct,
} from "../../reducers/UploadMeasuring";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ShapefileForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapContainerShapefile = useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [filesize, setFilesize] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const current_project_name = useSelector(
    (state) => state.project.current_project_name
  );

  const layers = useSelector((state) => state.uploadMeasuring.layers);
  const currentfile = useSelector((state) => state.uploadMeasuring.currentfile);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const project_id = useSelector((state) => state.project.project_id);
  const user_id = useSelector((state) => state.auth.user_id);

  const closeForm = () => {
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/delete-geojson/`, {
        filename: currentfile,
      })
      .then(() => {
        dispatch(setshowShapefileUpload(false));
        dispatch(setLayers([]));
        dispatch(setCurrentFile(null));
        setUploadedFile(null);
        setFileName("");
        setFilesize("");
        setLoaded(true);
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        console.log(error, "error");
        dispatch(setshowShapefileUpload(false));
        dispatch(setLayers([]));
        dispatch(setCurrentFile(null));
        setUploadedFile(null);
        setFileName("");
        setFilesize("");
        setLoaded(true);
        setLoading(false);
        setError("");
      });
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    dispatch(setshowShapefileUpload(false));
    const fileextension = currentfile.split(".").pop();
    let type_of_file = "Geojson";
    if (fileextension === "zip") {
      type_of_file = "Shapefile";
    } else if (fileextension === "geojson" || fileextension === "json") {
      type_of_file = "Geojson";
    }
    dispatch(setshowMapLoader(true));
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/upload-categories/?type_of_file=${type_of_file}&filename=${currentfile}&client_id=${client_id}&project_id=${project_id}&user_id=${user_id}`
      )
      .then((response) => {
        console.log(response.data, "response.data");
        console.log(response.data.distinct, "response.data.distinct");
        let distinct = response.data.distinct;
        const filtered = distinct.map((subArray) =>
          subArray.map((item) => ({
            ...item,
            checked: item.matched_category !== null,
          }))
        );
        dispatch(setdistinct(filtered));
        dispatch(setshowMapLoader(false));
        dispatch(setshowUploadingCategories(true));
      });
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerShapefile.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [11.326301469413806, 55.39925417342158],
      zoom: 15,
      attributionControl: false,
    });

    if (map) {
      window.mapshapefile = map;
    }

    map.addControl(new FullscreenControl());
    return () => {
      map.remove();
    };
  }, []);

  const handleLayerChange = (event, layer, extent) => {
    const map = window.mapshapefile;
    if (event.target.checked) {
      map.setLayoutProperty(`line-${layer}`, "visibility", "visible");
      map.setLayoutProperty(`polygon-${layer}`, "visibility", "visible");
      map.setLayoutProperty(`circle-${layer}`, "visibility", "visible");
      map.fitBounds(extent);
    } else {
      map.setLayoutProperty(`line-${layer}`, "visibility", "none");
      map.setLayoutProperty(`polygon-${layer}`, "visibility", "none");
      map.setLayoutProperty(`circle-${layer}`, "visibility", "none");
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 99999,
        }}
      >
        <form
          onSubmit={handleCreateProperty}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            background: "#fff",
            padding: "20px",
            zIndex: 99999,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                {t("Upload") + " " + t("Measurings")}: {current_project_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "red",
                }}
              >
                {error ? error : null}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <InputShapefileUpload
                fileName={fileName}
                filesize={filesize}
                loaded={loaded}
                setUploadedFile={setUploadedFile}
                setFileName={setFileName}
                setFilesize={setFilesize}
                setLoaded={setLoaded}
                setLoading={setLoading}
                setError={setError}
              />
              <Grid item>
                <div
                  style={{ width: "100%", height: "350px" }}
                  ref={mapContainerShapefile}
                  id="mapproperty"
                  className="mapproperty"
                >
                  {layers && layers.length > 0 ? (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        zIndex: 1000,
                        backgroundColor: "white",
                        borderRadius: 3,
                        paddingRight: 1,
                      }}
                    >
                      {layers.map((layer, index) => (
                        <FormGroup sx={{ margin: 0, padding: 0 }} key={index}>
                          <FormControlLabel
                            key={index}
                            slotProps={{
                              typography: {
                                fontSize: 10,
                                color: "#6A6D70",
                                fontWeight: 900,
                              },
                            }}
                            control={
                              <Checkbox
                                onChange={(event) =>
                                  handleLayerChange(
                                    event,
                                    layer.layername,
                                    layer.extent
                                  )
                                }
                                key={index}
                                size="small"
                                defaultChecked
                                sx={{
                                  "&:hover": { backgroundColor: "transparent" },
                                }}
                              />
                            }
                            label={layer.layername}
                            sx={{ margin: 0, padding: 0 }}
                          />
                        </FormGroup>
                      ))}
                    </Box>
                  ) : null}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant={loading ? "outlined" : "contained"}
                sx={{ mt: 0, mb: 0 }}
                disabled={!loaded}
              >
                {loading ? null : t("Create") + " " + t("Measurings")}
                {loading ? <CircularProgress /> : null}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={closeForm}
                variant="contained"
                color="error"
                size="small"
                fullWidth
              >
                {t("Close")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

ShapefileForm.propTypes = {};
