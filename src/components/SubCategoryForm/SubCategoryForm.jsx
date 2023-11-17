import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSubCategorys } from "../../reducers/SubCategory";
import AutoCompleteCustom from "../AutoCompleteCustom/AutoCompleteCustom";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";

export default function SubCategoryForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateSubCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    if (selectedCategoryId !== null) {
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        standard_category: selectedCategoryId,
      };
      axios
        .post(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`,
          data
        )
        .then(() => {
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Successfully Created Sub category"));
          dispatch(settoastType("success"));
          closeForm();
          axios
            .get(
              `${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`
            )
            .then((res) => {
              dispatch(setSubCategorys(res.data));
            });
        })
        .catch(() => {
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Failed to  Create Standard category"));
          dispatch(settoastType("error"));
          closeForm();
        });
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
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
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleCreateSubCategory}
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
                  onItemSelected={(id) => setSelectedCategoryId(id)}
                  category={"standard-category"}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Create Sub Category"}
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
      )}
    </>
  );
}
