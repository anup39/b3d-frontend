import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setTypeOfElement } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TextField from "@mui/material/TextField";

export default function TextFieldCategory() {
  const [checkedBox, setCheckedBox] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const typeOfElement = useSelector(
    (state) => state.editClassification.typeOfElement
  );

  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const handleEditCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    setLoading(false);
    const labelInput = document.getElementById("label");
    const valueInput = document.getElementById("value");

    console.log(labelInput.value, valueInput?.value, checkedBox);
  };

  const openForm = () => {
    // dispatch(setOpenCategoryEditForm(true));
  };

  const closeForm = () => {
    console.log("close form");
    dispatch(setTypeOfElement(null));
  };

  return (
    <>
      {typeOfElement && (
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
                  required
                  fullWidth
                  id="label"
                  label={t("Label")}
                  name="label"
                  autoComplete="label"
                />
              </Grid>
              {typeOfElement === "Text" ||
              typeOfElement === "Number" ||
              typeOfElement === "Url" ? (
                <Grid item xs={12}>
                  <TextField
                    type={typeOfElement === "Number" ? "number" : "text"}
                    required
                    fullWidth
                    id="value"
                    label={t("Value")}
                    name="value"
                    autoComplete="value"
                  />
                </Grid>
              ) : null}

              {typeOfElement === "Checkbox" ? (
                <Grid item xs={12}>
                  <Checkbox
                    id="checkbox-input"
                    label={t("Value")}
                    name="checkbox-input"
                    value={checkedBox}
                    onChange={(event) => {
                      setCheckedBox(event.target.checked);
                    }}
                  />
                </Grid>
              ) : null}

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
