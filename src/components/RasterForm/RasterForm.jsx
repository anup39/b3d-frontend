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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RasterForm({ onProgressForm, onProgressValue }) {
  const mapContainerRaster = useRef();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openrasterErrorToast, setOpenrasterErrorToast] = useState(false);
  const [openrasterSuccessToast, setOpenrasterSuccessToast] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleCreateraster = (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    console.log(nameInput.value, "name input");
    console.log(uploadedFile, "uploaded file ");
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
              width: "300px", // Adjust the width to your desired size
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
                <InputFileUpload onFileUpload={handleFileUpload} />
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
