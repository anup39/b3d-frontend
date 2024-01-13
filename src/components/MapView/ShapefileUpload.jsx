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
  setshowShapefileUpload,
  setshowUploadingCategories,
} from "../../reducers/MapView";
import {
  setCurrentFile,
  setLayers,
  setdistinct,
} from "../../reducers/UploadMeasuring";
import axios from "axios";

export default function ShapefileForm({}) {
  const dispatch = useDispatch();
  const mapContainerShapefile = useRef();
  //   const [isFormOpen, setIsFormOpen] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [projection, setProjection] = useState("");
  const [fileName, setFileName] = useState("");
  const [filesize, setFilesize] = useState("");
  const [image, setImage] = useState();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const layers = useSelector((state) => state.uploadMeasuring.layers);
  const currentfile = useSelector((state) => state.uploadMeasuring.currentfile);

  const closeForm = () => {
    // setIsFormOpen(false);
    dispatch(setshowShapefileUpload(false));
    dispatch(setLayers([]));
    dispatch(setCurrentFile(null));
    setUploadedFile(null);
    setProjection("");
    setFileName("");
    setFilesize("");
    setImage();
    setLoaded(false);
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const onProjection = (value) => {
    setProjection(value);
  };

  const onFileName = (value) => {
    setFileName(value);
  };

  const onSetFilesize = (value) => {
    setFilesize(value);
  };

  const onDoneLoaded = (value) => {
    setLoaded(value);
  };

  const onImage = (value) => {
    setImage(value);
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    dispatch(setshowUploadingCategories(true));
    dispatch(setshowShapefileUpload(false));
    const fileextension = currentfile.split(".").pop();
    let type_of_file = "Geojson";
    if (fileextension === "zip") {
      type_of_file = "Shapefile";
    } else if (fileextension === "geojson" || fileextension === "json") {
      type_of_file = "Geojson";
    }
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/upload-categories/?type_of_file=${type_of_file}&filename=${currentfile}`
      )
      .then((response) => {
        console.log(response.data, "response.data");
        dispatch(setdistinct(response.data.distinct));
      });
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerShapefile.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [103.8574, 2.2739],
      zoom: 10,
      attributionControl: false,
    });
    map.addControl(new FullscreenControl());
    window.mapshapefile = map;

    return () => {
      map.remove();
    };
  }, []);

  const handleLayerChange = (event, layer, extent) => {
    const map = window.mapshapefile;
    console.log(map);
    console.log(event.target.checked);
    console.log(layer);
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
            width: "500px",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Measuring for: Map Nov</Typography>
            </Grid>
            <Grid item xs={12}>
              <InputShapefileUpload
                mapref={mapContainerShapefile}
                fileName={fileName}
                filesize={filesize}
                projection={projection}
                onFileUpload={handleFileUpload}
                onProjection={onProjection}
                onDoneLoaded={onDoneLoaded}
                onImage={onImage}
                onFileName={onFileName}
                onSetFilesize={onSetFilesize}
                image={image}
                loaded={loaded}
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
                {loading ? null : "Add Property Map"}
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
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* )} */}
    </>
  );
}

ShapefileForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
  onProgressForm: PropTypes.func,
  onProgressValue: PropTypes.func,
  onSetRasters: PropTypes.func,
};
