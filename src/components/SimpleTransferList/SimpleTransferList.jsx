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

export default function SimpleTransferList({ id, component }) {
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
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/user-${component}/?user=${id}`
      )
      .then((res) => {
        const rightList = res.data.map((item) => item);

        console.log(rightList, "right list");

        if (component === "projects") {
          let global_url = `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/${component}/`;
          axios.get(global_url).then((res) => {
            const leftList = res.data.map((item) => item);
            console.log(leftList, "leftList");

            let filteredLeftList = leftList.filter(
              (item) =>
                !rightList.some(
                  (rightItem) => rightItem.project_name === item.name
                )
            );
            const filteredRightList = leftList.filter((item) =>
              rightList.some(
                (rightItem) => rightItem.project_name === item.name
              )
            );
            setInitialLeft(filteredLeftList);
            setInitialRight(filteredRightList);
            setFinalLeft(filteredLeftList);
            setFinalRight(filteredRightList);
          });
        }

        // Fetch data from the second API endpoint
      });
  }, [id, component]);

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
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
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
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
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

              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const handleSave = () => {
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

    if (component === "projects") {
      const project_url = `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/${component}`;
      if (itemsMovedToRight.length > 0) {
        itemsMovedToRight.map((item) => {
          const data = {
            name: item.name,
            description: item.description,
            project: id,
            is_display: true,
            view_name: item.full_name,
            global_standard_category: item.id,
          };
          axios.post(`${project_url}/`, data).then(() => {
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
            .get(`${project_url}/?project=${id}&view_name=${item.full_name}`)
            .then((res) => {
              const id = res.data[0].id;
              axios
                .delete(`${project_url}/${id}/`)
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
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList("Choices", finalLeft)}</Grid>
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
      <Grid item>{customList("Chosen", finalRight)}</Grid>
      <Grid item>
        <Button onClick={handleSave} variant="contained" color="success">
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

SimpleTransferList.propTypes = {
  id: PropTypes.number,
  component: PropTypes.string,
};
