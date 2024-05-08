import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setStandardCategorys } from "../../reducers/StandardCategory";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

export default function StandardCategoryForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleCreateStandardCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      created_by: user_id,
    };
    axios
      .post(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/global-standard-category/`,
        data
      )
      .then(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Successfully")} ${"Created"} ${t("Standard")} ${t(
              "Category"
            )}`
          )
        );
        dispatch(settoastType("success"));
        closeForm();

        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/global-standard-category/`
          )
          .then((res) => {
            dispatch(setStandardCategorys(res.data));
          });
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to load Standard Category"));
        dispatch(settoastType("error"));
        closeForm();
      });
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Tooltip title={t("Create") + " " + t("Standard") + " " + t("Category")}>
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          {t("Create") + " " + t("Standard") + " " + t("Category")}
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
            onSubmit={handleCreateStandardCategory}
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
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading
                    ? null
                    : t("Create") + " " + t("Standard") + " " + t("Category")}
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
                  {t("Close")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
