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
import { setCategoryStyles } from "../../reducers/CategoryStyle";
import AutoCompleteCustom from "../AutoCompleteCustom/AutoCompleteCustom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoryStyleForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openCategoryStyleErrorToast, setOpenCategoryStyleErrorToast] =
    useState(false);
  const [openCategoryStyleSuccessToast, setOpenCategoryStyleSuccessToast] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFillColor, setSelectedFillColor] = useState("#32788f");
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#d71414");

  const handleCreateCategoryStyle = (event) => {
    event.preventDefault();
    const fillOpacityInput = document.getElementById("fill_opacity");
    const strokeWidthInput = document.getElementById("stroke_width");

    if (
      selectedCategoryId !== null &&
      selectedFillColor !== null &&
      selectedStrokeColor !== null
    ) {
      const data = {
        fill: selectedFillColor,
        fill_opacity: fillOpacityInput.value,
        stroke: selectedStrokeColor,
        stroke_width: strokeWidthInput.value,
        category: selectedCategoryId,
      };
      axios
        .post(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category-style/`,
          data
        )
        .then(() => {
          setOpenCategoryStyleSuccessToast(true);
          setOpenCategoryStyleErrorToast(false);
          setTimeout(() => {
            setOpenCategoryStyleSuccessToast(false);
          }, 3000);
          axios
            .get(
              `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category-style/`
            )
            .then((res) => {
              dispatch(setCategoryStyles(res.data));
            });
        })
        .catch(() => {
          setOpenCategoryStyleErrorToast(true);
          setOpenCategoryStyleSuccessToast(false);
          setTimeout(() => {
            setOpenCategoryStyleErrorToast(false);
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryStyleErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create CategoryStyle"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create CategoryStyle
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryStyleSuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created CategoryStyle"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created CategoryStyle
        </Alert>
      </Snackbar>

      <Tooltip title="Create CategoryStyle">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create CategoryStyle
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
            onSubmit={handleCreateCategoryStyle}
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
                <AutoCompleteCustom
                  onItemSelected={(id) => setSelectedCategoryId(id)}
                  category={"category"}
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
