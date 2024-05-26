import Grid from "@mui/material/Grid";
import {
  Button,
  CircularProgress,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setOpenEditCustomFieldForm } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import axios from "axios";
import { setCategorys } from "../../reducers/Category";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function EditCustomFieldForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openEditCustomFieldForm = useSelector(
    (state) => state.editClassification.openEditCustomFieldForm
  );

  const [loading, setLoading] = useState(false);
  const categoryEditData = useSelector(
    (state) => state.editClassification.categoryEditData
  );
  const extra_fields = categoryEditData?.extra_fields;
  const [extraFields, setExtraFields] = useState([]);

  console.log(extraFields, "extraFields");

  const handleEditCategory = (event) => {
    event.preventDefault();
    setLoading(true);

    console.log(extra_fields, "extra_fields");
    console.log(extraFields, "extraFields");

    const newExtraFields = extraFields.filter((field) => !field.delete);

    const data = {
      extra_fields: { data: newExtraFields },
    };
    axios
      .patch(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/${
          categoryEditData.id
        }/`,
        data
      )
      .then(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`${t("Successfully")} ${t("Edited")}`));
        dispatch(settoastType("success"));
        closeForm();
        axios
          .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`)
          .then((res) => {
            // console.log(res.data);
            dispatch(setCategorys(res.data));
          })
          .catch(() => {});
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`${t("Failed")} ${t("To")}  ${t("Edit")}`));
        dispatch(settoastType("error"));
        closeForm();
      });
  };

  const closeForm = () => {
    console.log("close form");
    dispatch(setOpenEditCustomFieldForm(null));
  };

  const handleFieldChange = (index, name, value) => {
    console.log(extraFields, "extraFields");
    const newExtraFields = [...extraFields];
    newExtraFields[index][name] = value;
    setExtraFields(newExtraFields);
  };

  const handleSelectChange = (index, name, event) => {
    const selectedOptionId = parseInt(
      event.target.options[event.target.selectedIndex].getAttribute("id")
    );

    console.log(typeof selectedOptionId, "selectedOptionId");

    const newExtraFields = [...extraFields];
    console.log(newExtraFields, "newExtraFields");
    console.log(newExtraFields[index][name], "newExtraFields[index][name]");
    newExtraFields[index][name].map((option) => {
      if (option.id === selectedOptionId) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    setExtraFields(newExtraFields);
  };

  useEffect(() => {
    if (openEditCustomFieldForm && categoryEditData.extra_fields) {
      setExtraFields(
        JSON.parse(JSON.stringify(categoryEditData.extra_fields.data))
      );
    }
    return () => {
      setExtraFields([]);
    };
  }, [openEditCustomFieldForm, categoryEditData]);

  return (
    <>
      {openEditCustomFieldForm && (
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
                {extraFields && extraFields.length > 0 ? (
                  <>
                    {extraFields.map((field, index) => {
                      switch (field.type) {
                        case "Text":
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: "59%" }}
                                  size="small"
                                  required
                                  label={t("Label")}
                                  name="label"
                                  defaultValue={field.label}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                                <TextField
                                  sx={{ width: "59%" }}
                                  size="small"
                                  required
                                  label={t("Value")}
                                  name="value"
                                  defaultValue={field.value}
                                  onChange={(e) => {
                                    handleFieldChange(
                                      index,
                                      "value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </Box>

                              <span>
                                <label>Delete:</label>
                              </span>
                              <input
                                style={{ width: "5%" }}
                                onChange={(e) => {
                                  handleFieldChange(
                                    index,
                                    "delete",
                                    e.target.checked
                                  );
                                }}
                                type="checkbox"
                                defaultChecked={field.delete}
                              />
                            </Box>
                          );
                        case "Checkbox":
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                              }}
                              key={index}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: "48%" }}
                                  size="small"
                                  required
                                  label={t("Label")}
                                  name="label"
                                  defaultValue={field.label}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  style={{ width: "5%" }}
                                  onChange={(e) => {
                                    handleFieldChange(
                                      index,
                                      "value",
                                      e.target.checked
                                    );
                                  }}
                                  type="checkbox"
                                  defaultChecked={field.value}
                                />
                              </Box>
                              <span>
                                <label>Delete:</label>
                              </span>
                              <input
                                style={{ width: "5%" }}
                                onChange={(e) => {
                                  handleFieldChange(
                                    index,
                                    "delete",
                                    e.target.checked
                                  );
                                }}
                                type="checkbox"
                                defaultChecked={field.delete}
                              />
                            </Box>
                          );
                        case "Url":
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: "59%" }}
                                  size="small"
                                  required
                                  label={t("Label")}
                                  name="label"
                                  defaultValue={field.label}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  style={{ width: "59%" }}
                                  type="url"
                                  size="small"
                                  required
                                  label={t("Value")}
                                  name="value"
                                  defaultValue={field.value}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </Box>
                              <span>
                                <label>Delete:</label>
                              </span>
                              <input
                                style={{ width: "5%" }}
                                onChange={(e) => {
                                  handleFieldChange(
                                    index,
                                    "delete",
                                    e.target.checked
                                  );
                                }}
                                type="checkbox"
                                defaultChecked={field.delete}
                              />
                            </Box>
                          );
                        case "Number":
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: "59%" }}
                                  size="small"
                                  required
                                  label={t("Label")}
                                  name="label"
                                  defaultValue={field.label}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                                <TextField
                                  sx={{ width: "59%" }}
                                  type="number"
                                  size="small"
                                  required
                                  label={t("Value")}
                                  name="value"
                                  defaultValue={field.value}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </Box>

                              <span>
                                <label>Delete:</label>
                              </span>
                              <input
                                style={{ width: "5%" }}
                                onChange={(e) => {
                                  handleFieldChange(
                                    index,
                                    "delete",
                                    e.target.checked
                                  );
                                }}
                                type="checkbox"
                                defaultChecked={field.delete}
                              />
                            </Box>
                          );
                        case "Dropdown":
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: "59%" }}
                                  size="small"
                                  required
                                  label={t("Label")}
                                  name="label"
                                  defaultValue={field.label}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <select
                                  style={{
                                    width: 105,
                                    padding: "2px",
                                    border: "1px solid #000",
                                    borderRadius: "5px",
                                  }}
                                  required
                                  onChange={(event) =>
                                    handleSelectChange(index, "value", event)
                                  }
                                  value={
                                    field.value.find(
                                      (option) => option.selected
                                    ).value
                                  }
                                >
                                  {field.value.map((option, index) => (
                                    <option
                                      key={index}
                                      value={option.value}
                                      id={option.id}
                                      // selected={option.selected}
                                    >
                                      {option.value}
                                    </option>
                                  ))}
                                </select>
                                {/* <input
                                  value={option}
                                  style={{
                                    width: "80px",
                                    padding: "2px",
                                    border: "1px solid #000",
                                    borderRadius: "5px",
                                    marginLeft: "10px",
                                  }}
                                  type="text"
                                  placeholder="Add option"
                                  onChange={(event) => {
                                    console.log(event.target, "event.target");
                                    setOption(event.target.value);
                                  }}
                                ></input>
                                <Button onClick={handleAddOption}>Add</Button> */}
                              </Box>

                              <span>
                                <label>Delete:</label>
                              </span>
                              <input
                                style={{ width: "5%" }}
                                onChange={(e) => {
                                  handleFieldChange(
                                    index,
                                    "delete",
                                    e.target.checked
                                  );
                                }}
                                type="checkbox"
                                defaultChecked={field.delete}
                              />
                            </Box>
                          );
                        default:
                          return null;
                      }
                    })}
                  </>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : t("Edit")}
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
