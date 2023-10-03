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
import { setStandardCategorys } from "../../reducers/StandardCategory";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StandardCategoryForm() {
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openStandardCategoryErrorToast, setOpenStandardCategoryErrorToast] =
    useState(false);
  const [
    openStandardCategorySuccessToast,
    setOpenStandardCategorySuccessToast,
  ] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCreateStandardCategory = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      owner: 1,
    };
    axios
      .post(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/global-standard-category/`,
        data
      )
      .then(() => {
        setOpenStandardCategorySuccessToast(true);
        setOpenStandardCategoryErrorToast(false);
        setTimeout(() => {
          setOpenStandardCategorySuccessToast(false);
        }, 3000);
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/global-standard-category/`
          )
          .then((res) => {
            dispatch(setStandardCategorys(res.data));
          })
          .catch((error) => {});
      })
      .catch((error) => {
        setOpenStandardCategoryErrorToast(true);
        setOpenStandardCategorySuccessToast(false);
        setTimeout(() => {
          setOpenStandardCategoryErrorToast(false);
        }, 3000);
      });
    setAnchorElUser(null);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openStandardCategoryErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create StandardCategory"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create StandardCategory
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openStandardCategorySuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created StandardCategory"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created StandardCategory
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
            Create StandardCategory
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
                  onClick={handleCreateStandardCategory}
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
