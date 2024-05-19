import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCategorys } from "../../reducers/Category";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { setOpenCustomFieldForm } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function TextFieldCategory() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const typeOfElement = useSelector(
    (state) => state.editClassification.typeOfElement
  );
  const categoryEditData = useSelector(
    (state) => state.editClassification.categoryEditData
  );
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);

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
            fill_opacity: fillOpacityInput.value,
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
    dispatch(setOpenCustomFieldForm(false));
  };

  return (
    <>
      {typeOfElement === "Text" && (
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
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : t("Create")}
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
