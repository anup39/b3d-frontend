import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { createImagePNG } from "../../maputils/createMapImage";
import {
  setshowTifUpload,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import {
  setProgress,
  setproperties,
  setshowProgressFormOpen,
} from "../../reducers/Property";
import InputFileUpload from "./InputFileUpload";
import maplibregl from "maplibre-gl";
import PropTypes from "prop-types";

export default function UploadPropertyForm() {
  const dispatch = useDispatch();
  const mapContainerProperty = useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [projection, setProjection] = useState("");
  const [fileName, setFileName] = useState("");
  const [filesize, setFilesize] = useState("");
  const [image, setImage] = useState();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const client_id_property = useSelector(
    (state) => state.property.client_id_property
  );
  const project_id_property = useSelector(
    (state) => state.property.project_id_property
  );

  const closeForm = () => {
    dispatch(setshowTifUpload(false));
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
    setLoading(true);

    const nameInput = document.getElementById("name");
    const blob_ = createImagePNG(image);
    const formData = new FormData();
    formData.append("client", client_id_property);
    formData.append("project", project_id_property);
    formData.append("name", nameInput.value);
    formData.append("status", "Uploaded");
    formData.append("screenshot_image", blob_, "image.png");
    formData.append("file_size", uploadedFile.size);
    formData.append("projection", projection);
    formData.append("tif_file", uploadedFile);
    formData.append("file_name", fileName);
    formData.append("created_by", user_id);

    closeForm();

    dispatch(setshowProgressFormOpen(true));

    axios
      .post(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setProgress(percentCompleted));
          },
        }
      )
      .then(() => {
        dispatch(setshowProgressFormOpen(false));
        dispatch(setProgress(0));
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Successfully Created Property"));
        dispatch(settoastType("success"));
        closeForm();
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/raster-data/?project=${client_id_property}`
          )
          .then((res) => {
            dispatch(setproperties(res.data));
          });
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed Created Property"));
        dispatch(settoastType("error"));
        closeForm();
      });
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerProperty.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [103.8574, 2.2739],
      zoom: 10,
    });

    window.mapproperty = map;

    return () => {
      map.remove();
    };
  }, []);
  return (
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
          width: "300px",
          background: "#fff",
          padding: "20px",
          zIndex: 10000,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputFileUpload
              mapref={mapContainerProperty}
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
                style={{ width: "100%", height: "160px" }}
                ref={mapContainerProperty}
                id="mapproperty"
                className="mapproperty"
              />
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
  );
}

UploadPropertyForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
