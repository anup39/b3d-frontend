import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setInspections } from "../../reducers/Inspections";
import AutoCompleteInspection from "../StandardInspection/AutoCompleteInspection";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";

export default function InspectionForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedSubInspectionId, setSelectedSubInspectionId] = useState(null);
  const [selectedStandardInspectionId, setSelectedStandardInspectionId] =
    useState(null);
  const [selectedFillColor, setSelectedFillColor] = useState("#32788f");
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#d71414");
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleCreateInspection = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const fillOpacityInput = document.getElementById("fill_opacity");
    const strokeWidthInput = document.getElementById("stroke_width");

    if (selectedSubInspectionId !== null) {
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        sub_inspection: selectedSubInspectionId,
        standard_inspection: selectedStandardInspectionId,
        fill: selectedFillColor,
        fill_opacity: fillOpacityInput.value,
        stroke: selectedStrokeColor,
        stroke_width: strokeWidthInput.value,
        created_by: user_id,
      };

      axios
        .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/inspection/`, data)
        .then(() => {
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Successfully Created Standard category"));
          dispatch(settoastType("success"));
          closeForm();

          axios
            .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/inspection/`)
            .then((res) => {
              dispatch(setInspections(res.data));
            });
        })
        .catch(() => {
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(settoastMessage("Failed to load Inspection"));
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

  const handleFillColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedFillColor(newColor);
  };

  const handleStrokeColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedStrokeColor(newColor);
  };

  return (
    <>
      <Tooltip title="Create Inspection">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create Inspection
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
            onSubmit={handleCreateInspection}
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
                <AutoCompleteInspection
                  onItemSelected={(id, ids) => {
                    setSelectedSubInspectionId(id);
                    setSelectedStandardInspectionId(ids);
                  }}
                  category={"sub-inspection"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="fill_color"
                  type="color"
                  name="fill_color"
                  label="Fill Color"
                  variant="outlined"
                  size="small"
                  value={selectedFillColor}
                  onChange={handleFillColorChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="fill_opacity"
                  type="number"
                  name="fill_opacity"
                  label="Fill Opacity"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 1,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="stroke_color"
                  type="color"
                  name="stroke_color"
                  label="Stroke Color"
                  variant="outlined"
                  size="small"
                  value={selectedStrokeColor}
                  onChange={handleStrokeColorChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="stroke_width"
                  type="number"
                  name="stroke_width"
                  label="Stroke Width"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 5,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Create Inspection"}
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
