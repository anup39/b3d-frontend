import Grid from "@mui/material/Grid";
import React from "react";
import { Button, CircularProgress, Checkbox, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setTypeOfElement } from "../../reducers/EditClassification";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { setCategorys } from "../../reducers/Category";
import {
  useGetGlobalCategoryQuery,
  useUpdateGlobalCategoryMutation,
} from "../../api/globalCategoryApi";
import { useAddExtraFieldsMutation } from "../../api/updateExtraFieldsApi";

export default function Field() {
  const [checkedBox, setCheckedBox] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const typeOfElement = useSelector(
    (state) => state.editClassification.typeOfElement
  );

  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);
  const [selectedOption, setSelectedOption] = useState("");
  const [option, setOption] = useState("");
  const [options, setOptions] = useState([]);
  const categoryEditData = useSelector(
    (state) => state.editClassification.categoryEditData
  );

  const { data: globalCategories, refetch: refetchGlobalCategories } =
    useGetGlobalCategoryQuery();
  const [updateGlobalCategory] = useUpdateGlobalCategoryMutation();
  const [addExtraFields] = useAddExtraFieldsMutation();

  const handleEditCategory = (event) => {
    event.preventDefault();
    setLoading(true);
    const labelInput = document.getElementById("label");
    const valueInput = document.getElementById("value");

    console.log(categoryEditData, "categoryEditData");
    let new_item = {};
    if (typeOfElement === "Checkbox") {
      new_item = {
        type: typeOfElement,
        label: labelInput.value,
        value: checkedBox,
        delete: false,
      };
    } else if (typeOfElement === "Dropdown") {
      new_item = {
        type: typeOfElement,
        label: labelInput.value,
        value: options,
        delete: false,
      };
    } else {
      new_item = {
        type: typeOfElement,
        label: labelInput.value,
        value: valueInput.value,
        delete: false,
      };
    }

    let extra_fields = { ...categoryEditData.extra_fields };

    let newData = [];

    if (extra_fields.data) {
      console.log(extra_fields.data, "extra_fields.data");
      newData = [...extra_fields.data, new_item];
    } else {
      newData = [new_item];
    }

    const data = {
      extra_fields: { data: newData },
    };
    // axios
    //   .patch(
    //     `${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/${
    //       categoryEditData.id
    //     }/`,
    //     data
    //   )
    updateGlobalCategory({ category_id: categoryEditData.id, data })
      .unwrap()
      .then(() => {
        // Here update all  the annotations with new extra fields related to this category
        // axios
        //   .post(
        //     `${import.meta.env.VITE_API_DASHBOARD_URL}/update-extra-fields/`,
        //     {
        //       user_id: user_id,
        //       category_edit_data: categoryEditData,
        //       extra_fields: { data: newData },
        //     }
        //   )
        const data = {
          user_id: user_id,
          category_edit_data: categoryEditData,
          extraFields: { data: newData },
        };
        addExtraFields({ data })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`${t("Successfully")} ${t("Created")}`));
        dispatch(settoastType("success"));
        closeForm();
        // axios
        //   .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`)
        refetchGlobalCategories()
          .unwrap()
          .then((res) => {
            dispatch(setCategorys(res));
          })
          .catch(() => {});
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`${t("Failed")} ${t("To")}  ${t("Create")}`));
        dispatch(settoastType("error"));
        closeForm();
      });
  };

  const openForm = () => {
    // dispatch(setOpenCategoryEditForm(true));
  };

  const closeForm = () => {
    console.log("close form");
    dispatch(setTypeOfElement(null));
    setCheckedBox(false);
    setOption("");
    setOptions([]);
  };

  const handleSelectChange = (event) => {
    const selectedOptionId =
      event.target.options[event.target.selectedIndex].getAttribute("id");

    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === parseInt(selectedOptionId)
          ? { ...option, selected: true }
          : { ...option, selected: false }
      )
    );

    setSelectedOption(event.target.value);
  };

  const handleAddOption = () => {
    if (option) {
      setOptions((prevOptions) => [
        ...prevOptions,
        { id: prevOptions.length + 1, value: option, selected: false },
      ]);
      setOption("");
    }
  };

  useEffect(() => {
    setCheckedBox(false);
    setOption("");
    setOptions([]);
    return () => {
      setCheckedBox(false);
      setOption("");
      setOptions([]);
    };
  }, []);

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
                    disabled
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
                    disabled
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

              {typeOfElement === "Dropdown" ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <select
                      // disabled
                      // required
                      value={selectedOption}
                      onChange={handleSelectChange}
                    >
                      <option disabled value="">
                        --select an option--
                      </option>
                      {options.map((option, index) => (
                        <option
                          disabled
                          key={index}
                          value={option.value}
                          id={option.id}
                        >
                          {option.value}
                        </option>
                      ))}
                      {/* other options here */}
                    </select>
                    <input
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
                    <Button onClick={handleAddOption}>Add</Button>
                  </Box>
                  <Box>
                    {/* {options.map((option, index) => (
                      <React.Fragment key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <Typography>{option.value}</Typography>
                          <Delete
                            sx={{
                              cursor: "pointer",
                              color: "red",
                            }}
                            onClick={() => {
                              const newOptions = options.filter(
                                (opt) => opt !== option
                              );
                              setOptions(newOptions);
                            }}
                          ></Delete>
                        </Box>
                      </React.Fragment>
                    ))} */}
                  </Box>
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
