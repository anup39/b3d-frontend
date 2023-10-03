import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
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
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openProjectErrorToast, setOpenProjectErrorToast] = useState(false);
  const [openProjectSuccessToast, setOpenProjectSuccessToast] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCreateProject = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("here");

    // You can access the input values directly using their IDs
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");

    console.log({
      name: nameInput.value,
      description: descriptionInput.value,
      owner: 1,
    });
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
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        setOpenProjectErrorToast(true);
        setOpenProjectSuccessToast(false);
        setTimeout(() => {
          setOpenProjectErrorToast(false);
        }, 3000);
        console.log(error);
      });
    setAnchorElUser(null);
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
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button
            onClick={handleOpenUserMenu}
            sx={{ margin: "5px" }}
            variant="contained"
            color="error"
          >
            Create Project
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: "50px", maxWidth: "250px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  name="name"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleCreateProject}
                  sx={{ margin: "5px" }}
                  variant="contained"
                  color="success"
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
