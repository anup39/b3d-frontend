import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import {
  seterrorMessage,
  setshowErrorPopup,
} from "../../reducers/DisplaySettings";
import { useTranslation } from "react-i18next";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({ client_id, component }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [finalLeft, setFinalLeft] = useState([]);
  const [finalRight, setFinalRight] = useState([]);
  const [initialLeft, setInitialLeft] = useState([]);
  const [initialRight, setInitialRight] = useState([]);
  const leftChecked = intersection(checked, finalLeft);
  const rightChecked = intersection(checked, finalRight);
  const [openCategoryErrorToast, setOpenCategoryErrorToast] = useState(false);
  const [openCategorySuccessToast, setOpenCategorySuccessToast] =
    useState(false);
  const [loadingcontent, setLoadingContent] = useState(false);
  const [loading, setLoading] = useState(false);

  const user_id = useSelector((state) => state.auth.user_id);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setFinalRight(finalRight.concat(leftChecked));
    setFinalLeft(not(finalLeft, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setFinalLeft(finalLeft.concat(rightChecked));
    setFinalRight(not(finalRight, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    // Fetch data from the first API endpoint
    setLoadingContent(true);
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/${component}/?client=${client_id}`
      )
      .then((res) => {
        const rightList = res.data.map((item) => item);

        if (component === "standard-category") {
          let global_url = `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/global-${component}/`;
          axios.get(global_url).then((res) => {
            const leftList = res.data.map((item) => item);
            let filteredLeftList = leftList.filter(
              (item) =>
                !rightList.some(
                  (rightItem) => rightItem.full_name === item.full_name
                )
            );
            const filteredRightList = leftList.filter((item) =>
              rightList.some(
                (rightItem) => rightItem.full_name === item.full_name
              )
            );
            setInitialLeft(filteredLeftList);
            setInitialRight(filteredRightList);
            setFinalLeft(filteredLeftList);
            setFinalRight(filteredRightList);
          });
        }

        if (component === "sub-category") {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/${"standard-category"}/?client=${client_id}`
            )
            .then((res) => {
              const prevList = res.data.map((item) => item);
              const uniqueGlobalStandardCategories = [
                ...new Set(
                  prevList.map((item) => item.global_standard_category)
                ),
              ];
              if (uniqueGlobalStandardCategories.length > 0) {
                const standardCategoryIds =
                  uniqueGlobalStandardCategories.join(",");
                const global_url = `${
                  import.meta.env.VITE_API_DASHBOARD_URL
                }/global-${component}/?standard_category_ids=${standardCategoryIds}`;
                axios.get(global_url).then((res) => {
                  const leftList = res.data.map((item) => item);
                  let filteredLeftList = leftList.filter(
                    (item) =>
                      !rightList.some(
                        (rightItem) => rightItem.full_name === item.full_name
                      )
                  );
                  let filteredRightList = leftList.filter((item) =>
                    rightList.some(
                      (rightItem) => rightItem.full_name === item.full_name
                    )
                  );

                  if (!rightList.length > 0) {
                    filteredRightList = [];
                  }
                  setInitialLeft(filteredLeftList);
                  setInitialRight(filteredRightList);
                  setFinalLeft(filteredLeftList);
                  setFinalRight(filteredRightList);
                });
              }
            });
        }
        if (component === "category") {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/${"sub-category"}/?client=${client_id}`
            )
            .then((res) => {
              const prevList = res.data.map((item) => item);
              const uniqueGlobalStandardCategories = [
                ...new Set(
                  prevList.map((item) => item.global_standard_category)
                ),
              ];
              if (uniqueGlobalStandardCategories.length > 0) {
                const standardCategoryIds =
                  uniqueGlobalStandardCategories.join(",");
                const uniqueGlobalSubCategories = [
                  ...new Set(prevList.map((item) => item.global_sub_category)),
                ];
                if (uniqueGlobalSubCategories.length > 0) {
                  const subCategoryIds = uniqueGlobalSubCategories.join(",");
                  const global_url = `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/global-${component}/?standard_category_ids=${standardCategoryIds}&sub_category_ids=${subCategoryIds}`;
                  axios.get(global_url).then((res) => {
                    const leftList = res.data.map((item) => item);
                    let filteredLeftList = leftList.filter(
                      (item) =>
                        !rightList.some(
                          (rightItem) => rightItem.full_name === item.full_name
                        )
                    );

                    let filteredRightList = leftList.filter((item) =>
                      rightList.some(
                        (rightItem) => rightItem.full_name === item.full_name
                      )
                    );

                    if (!rightList.length > 0) {
                      filteredRightList = [];
                    }
                    setInitialLeft(filteredLeftList);
                    setInitialRight(filteredRightList);
                    setFinalLeft(filteredLeftList);
                    setFinalRight(filteredRightList);
                  });
                }
              }
            });
        }

        setLoadingContent(false);

        // Fetch data from the second API endpoint
      });
  }, [client_id, component]);

  const customList = (title, items) => (
    <Card sx={{ backgroundColor: "#828282" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message={`Failed to Created ${component}`}
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create {component} .
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategorySuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message={`Sucessfully Created ${component}`}
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created {component}
        </Alert>
      </Snackbar>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} ${t("Selected")}`}
      />
      <Divider />
      <List
        sx={{
          width: 250,
          height: 300,
          bgcolor: "white",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {!loadingcontent ? (
          <>
            {items.map((value) => {
              const labelId = `transfer-list-all-item-${value}-label`;

              return (
                <ListItem
                  key={value.id}
                  role="listitem"
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText id={labelId} primary={value.full_name} />
                </ListItem>
              );
            })}
          </>
        ) : (
          <Box sx={{ marginLeft: "40%", marginTop: "50%" }}>
            <CircularProgress />
          </Box>
        )}
      </List>
    </Card>
  );

  const handleSave = () => {
    setLoading(true);
    const itemsMovedToLeft = finalLeft.filter(
      (item) =>
        !initialLeft.some((leftItem) => leftItem.full_name === item.full_name)
    );
    const itemsMovedToRight = finalRight.filter(
      (item) =>
        !initialRight.some(
          (rightItem) => rightItem.full_name === item.full_name
        )
    );

    if (component === "standard-category") {
      const client_url = `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/${component}`;
      if (itemsMovedToRight.length > 0) {
        itemsMovedToRight.map((item) => {
          const data = {
            name: item.name,
            description: item.description,
            client: client_id,
            is_display: true,
            view_name: item.full_name,
            global_standard_category: item.id,
            created_by: user_id,
          };
          axios.post(`${client_url}/`, data).then(() => {
            setOpenCategorySuccessToast(true);
            setOpenCategoryErrorToast(false);
            setTimeout(() => {
              setOpenCategorySuccessToast(false);
            }, 3000);
          });
        });
      }
      if (itemsMovedToLeft.length > 0) {
        itemsMovedToLeft.map((item) => {
          axios
            .get(
              `${client_url}/?client=${client_id}&view_name=${item.full_name}`
            )
            .then((res) => {
              const id = res.data[0].id;
              // here check if the subcategory exists with this standard category

              console.log(id, "id");

              axios
                .get(
                  `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/sub-category/?standard_category=${id}`
                )
                .then((res) => {
                  console.log(res.data);
                  if (res.data.length > 0) {
                    dispatch(setshowErrorPopup(true));
                    dispatch(
                      seterrorMessage(
                        `Cannot remove standard category ${item.name} since it is used in sub category . Remove it from sub category first  `
                      )
                    );
                  } else {
                    axios
                      .delete(`${client_url}/${id}/`)
                      .then(() => {
                        setOpenCategorySuccessToast(true);
                        setOpenCategoryErrorToast(false);
                        setTimeout(() => {
                          setOpenCategorySuccessToast(false);
                        }, 3000);
                      })
                      .catch(() => {
                        setOpenCategoryErrorToast(true);
                        setOpenCategorySuccessToast(false);
                        setTimeout(() => {
                          setOpenCategoryErrorToast(false);
                        }, 3000);
                      });
                  }
                });
            });
        });
      }
    }
    if (component === "sub-category") {
      const client_url = `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/${component}`;
      if (itemsMovedToRight.length > 0) {
        itemsMovedToRight.map((item) => {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/${"standard-category"}/?client=${client_id}&view_name=${
                item.standard_category_name
              }`
            )
            .then((res) => {
              const client_s_c_id = res.data[0].id;
              const data = {
                name: item.name,
                client: client_id,
                standard_category: client_s_c_id,
                global_standard_category: item.standard_category,
                global_sub_category: item.id,
                description: item.description,
                is_display: true,
                view_name: item.full_name,
                created_by: user_id,
              };
              axios.post(`${client_url}/`, data).then(() => {
                setOpenCategorySuccessToast(true);
                setOpenCategoryErrorToast(false);
                setTimeout(() => {
                  setOpenCategorySuccessToast(false);
                }, 3000);
              });
            });
        });
      }
      if (itemsMovedToLeft.length > 0) {
        itemsMovedToLeft.map((item) => {
          axios
            .get(
              `${client_url}/?client=${client_id}&view_name=${item.full_name}`
            )
            .then((res) => {
              const id = res.data[0].id;
              // here check if the category exists with this sub category
              console.log(id, "id");

              axios
                .get(
                  `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/category/?sub_category=${id}`
                )
                .then((res) => {
                  if (res.data.length > 0) {
                    dispatch(setshowErrorPopup(true));
                    dispatch(
                      seterrorMessage(
                        `Cannot remove sub category ${item.name} since it is used in  category . Remove it from  category first  `
                      )
                    );
                  } else {
                    axios
                      .delete(`${client_url}/${id}/`)
                      .then(() => {
                        setOpenCategorySuccessToast(true);
                        setOpenCategoryErrorToast(false);
                        setTimeout(() => {
                          setOpenCategorySuccessToast(false);
                        }, 3000);
                      })
                      .catch(() => {
                        setOpenCategoryErrorToast(true);
                        setOpenCategorySuccessToast(false);
                        setTimeout(() => {
                          setOpenCategoryErrorToast(false);
                        }, 3000);
                      });
                  }
                });
            });
        });
      }
    }
    if (component === "category") {
      const client_url = `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/${component}`;
      if (itemsMovedToRight.length > 0) {
        itemsMovedToRight.map((item) => {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/${"sub-category"}/?client=${client_id}&view_name=${
                item.sub_category_name
              }`
            )
            .then((res) => {
              const client_s_c_id = res.data[0].standard_category;
              const client_sub_c_id = res.data[0].id;
              const data = {
                name: item.name,
                client: client_id,
                standard_category: client_s_c_id,
                global_standard_category: item.standard_category,
                sub_category: client_sub_c_id,
                global_sub_category: item.sub_category,
                global_category: item.id,
                description: item.description,
                type_of_geometry: item.type_of_geometry,
                is_display: true,
                view_name: item.full_name,
                created_by: user_id,
              };
              axios.post(`${client_url}/`, data).then(() => {
                setOpenCategorySuccessToast(true);
                setOpenCategoryErrorToast(false);
                setTimeout(() => {
                  setOpenCategorySuccessToast(false);
                }, 3000);
              });
            });
        });
      }
      if (itemsMovedToLeft.length > 0) {
        itemsMovedToLeft.map((item) => {
          axios
            .get(
              `${client_url}/?client=${client_id}&view_name=${item.full_name}`
            )
            .then((res) => {
              const id = res.data[0].id;
              axios
                .delete(`${client_url}/${id}/`)
                .then(() => {
                  setOpenCategorySuccessToast(true);
                  setOpenCategoryErrorToast(false);
                  setTimeout(() => {
                    setOpenCategorySuccessToast(false);
                  }, 3000);
                })
                .catch(() => {
                  setOpenCategoryErrorToast(true);
                  setOpenCategorySuccessToast(false);
                  setTimeout(() => {
                    setOpenCategoryErrorToast(false);
                  }, 3000);
                });
            });
        });
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(t("Choices"), finalLeft)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(t("Choices"), finalRight)}</Grid>
      <Grid item>
        <Button
          onClick={handleSave}
          type="submit"
          fullWidth
          variant={loading ? "outlined" : "contained"}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? null : t("Save")}
          {loading ? <CircularProgress /> : null}
        </Button>
      </Grid>
    </Grid>
  );
}

TransferList.propTypes = {
  client_id: PropTypes.number,
  component: PropTypes.string,
};
