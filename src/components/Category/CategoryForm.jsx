import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCategorys } from "../../reducers/Category";
import AutoCompleteCustom from "../StandardCategory/AutoCompleteCustom";
import Autocomplete from "@mui/material/Autocomplete";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useTranslation } from "react-i18next";

export default function CategoryForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStandradCategoryId, setSelectedStandradCategoryId] =
    useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFillColor, setSelectedFillColor] = useState("#32788f");
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#d71414");
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleCreateCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const fillOpacityInput = document.getElementById("fill_opacity");
    const strokeWidthInput = document.getElementById("stroke_width");

    if (selectedCategoryId !== null) {
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        sub_category: selectedCategoryId,
        standard_category: selectedStandradCategoryId,
        type_of_geometry: inputValue,
        created_by: user_id,
      };

      axios
        .post(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`,
          data
        )
        .then((res) => {
          const style_data = {
            fill: selectedFillColor,
            fill_opacity: fillOpacityInput.value,
            stroke: selectedStrokeColor,
            stroke_width: strokeWidthInput.value,
            category: res.data.id,
            created_by: user_id,
          };
          axios
            .post(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/global-category-style/`,
              style_data
            )
            .then(() => {
              setLoading(false);
              dispatch(setshowToast(true));
              dispatch(
                settoastMessage(
                  `${t("Category")} ${t("Created")} ${t("Successfully")}`
                )
              );
              dispatch(settoastType("success"));
              closeForm();
              axios
                .get(
                  `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`
                )
                .then((res) => {
                  dispatch(setCategorys(res.data));
                })
                .catch(() => {});
            });
        })
        .catch(() => {
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              `${t("Failed")} ${t("To")} ${t("Create")} ${t("Category")}`
            )
          );
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
      <Tooltip title={t("Create") + " " + t("Category")}>
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          {t("Create") + " " + t("Category")}
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
                  label={t("Name")}
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
                  label={t("Description")}
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
                      label={t("Type") + " " + t("Of") + " " + t("Geometry")}
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
                <TextField
                  id="fill_color"
                  type="color"
                  name="fill_color"
                  label={t("Fill") + " " + t("Color")}
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
                  label={t("Fill") + " " + t("Opacity")}
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
                  label={t("Stroke") + " " + t("Color")}
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
                  label={t("Stroke") + " " + t("Width")}
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
                  {loading ? null : t("Create") + " " + t("Category")}
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
                  {t("Cancel")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
