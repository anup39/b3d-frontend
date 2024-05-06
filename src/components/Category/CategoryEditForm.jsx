import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCategorys } from "../../reducers/Category";
import Autocomplete from "@mui/material/Autocomplete";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { setOpenCategoryEditForm } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";

export default function CategoryEditForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openCategoryEditForm = useSelector(
    (state) => state.editClassification.openCategoryEditForm
  );
  const categoryEditData = useSelector(
    (state) => state.editClassification.categoryEditData
  );
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);

  const [selectedStandardCategory, setSelectedStandardCategory] =
    useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFillColor, setSelectedFillColor] = useState("#32788f");
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#d71414");
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleEditCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const fillOpacityInput = document.getElementById("fill_opacity");
    const strokeWidthInput = document.getElementById("stroke_width");

    if (value !== null) {
      const data = {
        name: nameInput.value,
        description: descriptionInput.value,
        sub_category: value.id,
        standard_category: selectedStandardCategory,
        type_of_geometry: inputValue,
        created_by: user_id,
      };
      console.log(data, "data");

      axios
        .patch(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/${
            categoryEditData.id
          }/`,
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
            .patch(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/global-category-style/${categoryEditData.style.id}/`,
              style_data
            )
            .then(() => {
              setLoading(false);
              dispatch(setshowToast(true));
              dispatch(
                settoastMessage(
                  `${t("Successfully")} ${t("Edited")} ${t("Category")}`
                )
              );
              dispatch(settoastType("success"));
              closeForm();
              axios
                .get(
                  `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`
                )
                .then((res) => {
                  console.log(res.data);
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
              `${t("Failed")} ${t("To")}  ${t("Edit")} ${t("Category")}`
            )
          );
          dispatch(settoastType("error"));
          closeForm();
        });
    }
  };

  const openForm = () => {
    dispatch(setOpenCategoryEditForm(true));
  };

  const closeForm = () => {
    console.log("close form");
    dispatch(setOpenCategoryEditForm(false));
  };

  const handleFillColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedFillColor(newColor);
  };

  const handleStrokeColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedStrokeColor(newColor);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`)
      .then((response) => {
        setOptions(response.data);
        console.log(categoryEditData);
        setValue(
          response.data.find(
            (option) => option.id === categoryEditData?.sub_category
          ) || null
        );
        setInputValue(categoryEditData?.type_of_geometry);
        setSelectedStandardCategory(categoryEditData?.standard_category);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [categoryEditData]);

  return (
    <>
      {openCategoryEditForm && (
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
            onSubmit={handleEditCategory}
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
                  defaultValue={categoryEditData?.name}
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
                  defaultValue={categoryEditData?.description}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  disableClearable
                  id="autocomplete-sub-category"
                  options={options}
                  getOptionLabel={(option) => option.full_name}
                  sx={{ width: 300 }}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ fontFamily: "Roboto", fontSize: "7px" }}
                      variant="outlined"
                      placeholder={t("Sub") + " " + t("Category")}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  disabled
                  id="type-of-geometry"
                  options={["Polygon", "LineString", "Point"]}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  defaultValue={categoryEditData?.type_of_geometry}
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
                  // value={selectedFillColor}
                  onChange={handleFillColorChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  defaultValue={categoryEditData?.style?.fill}
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
                  defaultValue={categoryEditData?.style?.fill_opacity}
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
                  // value={selectedStrokeColor}
                  onChange={handleStrokeColorChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  defaultValue={categoryEditData?.style?.stroke}
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
                  defaultValue={categoryEditData?.style?.stroke_width}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : t("Edit") + " " + t("Category")}
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
