import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setProjects } from "../../reducers/Project";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProjectForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openProjectErrorToast, setOpenProjectErrorToast] = useState(false);
  const [openProjectSuccessToast, setOpenProjectSuccessToast] = useState(false);

  const handleCreateProject = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      owner: 1,
    };
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/`, data)
      .then(() => {
        setOpenProjectSuccessToast(true);
        setOpenProjectErrorToast(false);
        setTimeout(() => {
          setOpenProjectSuccessToast(false);
        }, 3000);
        axios
          .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/`)
          .then((res) => {
            dispatch(setProjects(res.data));
          });
      })
      .catch(() => {
        setOpenProjectErrorToast(true);
        setOpenProjectSuccessToast(false);
        setTimeout(() => {
          setOpenProjectErrorToast(false);
        }, 3000);
      });
    closeForm();
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openProjectErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create Project"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create Project
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openProjectSuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created Project"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created Project
        </Alert>
      </Snackbar>

      <Tooltip title="Create Project">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create Project
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
            onSubmit={handleCreateProject}
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
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth // Use fullWidth to make the input occupy the form's width
                />
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
