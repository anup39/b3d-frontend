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
import { setCategorys } from "../../reducers/Category";
import AutoCompleteCustom from "../AutoCompleteCustom/AutoCompleteCustom";
import Autocomplete from "@mui/material/Autocomplete";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoryForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openCategoryErrorToast, setOpenCategoryErrorToast] = useState(false);
  const [openCategorySuccessToast, setOpenCategorySuccessToast] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStandradCategoryId, setSelectedStandradCategoryId] =
    useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleCreateCategory = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");

    if (selectedCategoryId !== null) {
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        sub_category: selectedCategoryId,
        standard_category: selectedStandradCategoryId,
        type_of_geometry: inputValue,
      };
      axios
        .post(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`,
          data
        )
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
            .catch(() => {});
        })
        .catch(() => {
          setOpenCategoryErrorToast(true);
          setOpenCategorySuccessToast(false);
          setTimeout(() => {
            setOpenCategoryErrorToast(false);
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
        open={openCategoryErrorToast}
        autoHideDuration={6000}
        message="Failed to Create Category"
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Failed to Create Category
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategorySuccessToast}
        autoHideDuration={6000}
        message="Sucessfully Created Category"
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Sucessfully Created Category
        </Alert>
      </Snackbar>

      <Tooltip title="Create Category">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create Category
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
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleCreateCategory}
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
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <AutoCompleteCustom
                  onItemSelected={(id, ids) => {
                    setSelectedCategoryId(id);
                    setSelectedStandradCategoryId(ids);
                  }}
                  category={"sub-category"}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  id="type-of-geometry"
                  options={["Polygon", "LineString", "Point"]}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type of Geometry"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputValue(newValue);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
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
                  fullWidth
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
