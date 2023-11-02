import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setRasters } from "../../reducers/Raster";
import InputFileUpload from "../InputFileUpload/InputFileUpload";
import maplibregl from "maplibre-gl";
import createMapImage from "../../maputils/createMapImage";
import PropTypes from "prop-types";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RasterForm({
  project_id,
  onProgressForm,
  onProgressValue,
}) {
  const mapContainerRaster = useRef();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openrasterErrorToast, setOpenrasterErrorToast] = useState(false);
  const [openrasterSuccessToast, setOpenrasterSuccessToast] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [projection, setProjection] = useState("");
  const [fileName, setFileName] = useState("");
  const [filesize, setFilesize] = useState("");

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setOpenrasterErrorToast(false);
    setOpenrasterSuccessToast(false);
    setUploadedFile(null);
    setProjection("");
    setFileName("");
    setFilesize("");
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

  const handleCreateraster = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const image_ = createMapImage(window.mapraster);
    const formData = new FormData();
    formData.append("project", project_id);
    formData.append("name", nameInput.value);
    formData.append("status", "Uploaded");
    formData.append("screenshot_image", image_, "image.png");
    formData.append("file_size", uploadedFile.size);
    formData.append("projection", projection);
    formData.append("tif_file", uploadedFile);
    formData.append("file_name", fileName);

    console.log("project", project_id);
    console.log("name", nameInput.value);
    console.log("status", "Uploaded");
    console.log(image_, "image");
    console.log("file_size", uploadedFile.size);
    console.log("projection", projection);
    console.log("tif_file", uploadedFile);
    console.log("file_name", fileName);

    // axios
    //   .post(
    //     `${import.meta.env.VITE_API_DASHBOARD_URL}/send-email-price/`,
    //     formData
    //   )
    //   .then(() => {})
    //   .catch((error) => {
    //     console.log(error);
    //   });

    closeForm();
    if (onProgressForm) {
      onProgressForm(true);
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((item) => {
        setTimeout(() => {
          onProgressValue(item);
        }, 10000);
      });
    }
  };

  useEffect(() => {
    if (isFormOpen) {
      const map = new maplibregl.Map({
        container: mapContainerRaster.current,
        style: `https://api.maptiler.com/maps/satellite/style.json?key=${
          import.meta.env.VITE_MAPTILER_TOKEN
        }`,
        center: [103.8574, 2.2739],
        zoom: 10,
      });

      window.mapraster = map;

      return () => {
        map.remove();
      };
    }
  }, [isFormOpen]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openrasterErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create raster"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create raster
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openrasterSuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created raster"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created raster
        </Alert>
      </Snackbar>

      <Tooltip title="Create raster">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Upload Raster
        </Button>
      </Tooltip>
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
            zIndex: 9999, // Higher z-index to cover other elements
          }}
        >
          <form
            onSubmit={handleCreateraster}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px", // Adjust the width to your desired size
              background: "#fff",
              padding: "20px",
              zIndex: 10000, // Higher z-index for the form
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
                  fullWidth // Use fullWidth to make the input occupy the form's width
                />
              </Grid>
              <Grid item xs={12}>
                <InputFileUpload
                  fileName={fileName}
                  filesize={filesize}
                  projection={projection}
                  onFileUpload={handleFileUpload}
                  onProjection={onProjection}
                  onFileName={onFileName}
                  onSetFilesize={onSetFilesize}
                />
                <Grid item>
                  <div
                    style={{ width: "100%", height: "300px" }}
                    ref={mapContainerRaster}
                    id="mapraster"
                    className="mapraster"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth // Use fullWidth to make the button occupy the form's width
                >
                  Done
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth // Use fullWidth to make the button occupy the form's width
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}

RasterForm.propTypes = {
  project_id: PropTypes.string,
  onProgressForm: PropTypes.func,
  onProgressValue: PropTypes.func,
};
