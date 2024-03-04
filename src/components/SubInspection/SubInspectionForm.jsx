import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSubInspections } from "../../reducers/SubInspection";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import AutoCompleteInspection from "../StandardInspection/AutoCompleteInspection";

export default function SubInspectionForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStandardInspectionId, setSelectedStandardInspectionId] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleCreateSubInspection = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    // if (selectedStandardInspectionId !== null) {
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      // standard_inspection: null,
      created_by: user_id,
    };
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/sub-inspection/`, data)
      .then(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Successfully Created Sub category"));
        dispatch(settoastType("success"));
        closeForm();
        axios
          .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/sub-inspection/`)
          .then((res) => {
            dispatch(setSubInspections(res.data));
          });
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to  Create Sub Inspection"));
        dispatch(settoastType("error"));
        closeForm();
      });
    // }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Tooltip title="Create SubInspection">
        <Button
          onClick={openForm}
          sx={{ marginBottom: "25px" }}
          variant="contained"
          color="error"
        >
          Create SubInspection
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
            onSubmit={handleCreateSubInspection}
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
              {/* <Grid item xs={12}>
                <AutoCompleteInspection
                  onItemSelected={(id) => setSelectedStandardInspectionId(id)}
                  category={"standard-inspection"}
                />
              </Grid> */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Create Sub Inspection"}
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
