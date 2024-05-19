import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import { setOpenCustomFieldForm } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { setTypeOfElement } from "../../reducers/EditClassification";

export default function AddCustomField() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openCustomFieldForm = useSelector(
    (state) => state.editClassification.openCustomFieldForm
  );

  const [inputValue, setInputValue] = useState("Text");
  const [loading, setLoading] = useState(false);

  const handleEditCategory = (event) => {
    console.log(inputValue, "inputValue");
    event.preventDefault();
    setLoading(true);
    dispatch(setTypeOfElement(inputValue));
    setLoading(false);
    dispatch(setOpenCustomFieldForm(false));
  };

  const closeForm = () => {
    console.log("close form");
    dispatch(setOpenCustomFieldForm(false));
    dispatch(setTypeOfElement(null));
  };

  return (
    <>
      {openCustomFieldForm && (
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
                <Autocomplete
                  disablePortal
                  id="type-of-element"
                  options={["Text", "Checkbox", "Url", "Number"]}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  defaultValue={"Text"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("Type") + " " + t("Of") + " " + t("Element")}
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
