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
import { setSubCategorys } from "../../reducers/SubCategory";
import AutoCompleteCustom from "../AutoCompleteCustom/AutoCompleteCustom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SubCategoryForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openSubCategoryErrorToast, setOpenSubCategoryErrorToast] =
    useState(false);
  const [openSubCategorySuccessToast, setOpenSubCategorySuccessToast] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCreateSubCategory = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    // Check if a category is selected
    if (selectedCategoryId !== null) {
      // Use selectedCategoryId in your form submission logic
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        standard_category: selectedCategoryId, // Use the selected category ID
      };
      axios
        .post(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`,
          data
        )
        .then(() => {
          setOpenSubCategorySuccessToast(true);
          setOpenSubCategoryErrorToast(false);
          setTimeout(() => {
            setOpenSubCategorySuccessToast(false);
          }, 3000);
          axios
            .get(
              `${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`
            )
            .then((res) => {
              dispatch(setSubCategorys(res.data));
            });
        })
        .catch(() => {
          setOpenSubCategoryErrorToast(true);
          setOpenSubCategorySuccessToast(false);
          setTimeout(() => {
            setOpenSubCategoryErrorToast(false);
          }, 3000);
        });
    }
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
        open={openSubCategoryErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create SubCategory"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create SubCategory
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSubCategorySuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created SubCategory"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created SubCategory
        </Alert>
      </Snackbar>
      {/* <Box sx={{ flexGrow: 0 }}> */}
      <Tooltip title="Create SubCategory">
        <Button
          onClick={openForm}
          sx={{ marginBottom: "25px" }}
          variant="contained"
          color="error"
        >
          Create SubCategory
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
            onSubmit={handleCreateSubCategory}
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
                <AutoCompleteCustom
                  onItemSelected={(id) => setSelectedCategoryId(id)}
                  category={"standard-category"}
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
