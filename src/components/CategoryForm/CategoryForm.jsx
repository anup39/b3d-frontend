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
import { setCategorys } from "../../reducers/Category";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoryForm() {
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openCategoryErrorToast, setOpenCategoryErrorToast] = useState(false);
  const [openCategorySuccessToast, setOpenCategorySuccessToast] =
    useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCreateCategory = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      owner: 1,
    };
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`, data)
      .then(() => {
        setOpenCategorySuccessToast(true);
        setOpenCategoryErrorToast(false);
        setTimeout(() => {
          setOpenCategorySuccessToast(false);
        }, 3000);
        axios
          .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`)
          .then((res) => {
            dispatch(setCategorys(res.data));
          })
          .catch((error) => {});
      })
      .catch((error) => {
        setOpenCategoryErrorToast(true);
        setOpenCategorySuccessToast(false);
        setTimeout(() => {
          setOpenCategoryErrorToast(false);
        }, 3000);
      });
    setAnchorElUser(null);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create Category"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create Category
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategorySuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created Category"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created Category
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
            Create Category
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: "50px", maxWidth: "300px" }}
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
                  style={{ width: "200px" }}
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
                  style={{ width: "200px" }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleCreateCategory}
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
