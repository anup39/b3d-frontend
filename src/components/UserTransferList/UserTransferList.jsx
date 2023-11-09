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
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  settoastMessage,
  setshowToast,
  settoastType,
} from "../../reducers/DisplaySettings";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function UserTransferList({ id, component }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [finalLeft, setFinalLeft] = useState([]);
  const [finalRight, setFinalRight] = useState([]);
  const [initialLeft, setInitialLeft] = useState([]);
  const [initialRight, setInitialRight] = useState([]);
  const leftChecked = intersection(checked, finalLeft);
  const rightChecked = intersection(checked, finalRight);
  const [loading, setLoading] = useState(false);
  const username_current = useSelector((state) => state.auth.username);

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
        `${import.meta.env.VITE_API_DASHBOARD_URL}/user-projects/?project=${id}`
      )
      .then((res) => {
        const rightList = res.data.map((item) => item);

        if (component === "users") {
          let global_url = `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/${component}/`;
          axios.get(global_url).then((res) => {
            const leftList = res.data.map((item) => item);

            let filteredLeftList = leftList.filter(
              (item) =>
                item.username !== username_current &&
                item.role_name !== "admin" &&
                !rightList.some(
                  (rightItem) => rightItem.user_name === item.username
                )
            );
            const filteredRightList = leftList.filter(
              (item) =>
                item.username !== username_current &&
                item.role_name !== "admin" &&
                rightList.some(
                  (rightItem) => rightItem.user_name === item.username
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
  }, [id, component, username_current]);

  const customList = (title, items) => (
    <Card sx={{ backgroundColor: "#828282" }}>
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

              <ListItemText id={labelId} primary={value.username} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const handleSave = () => {
    const itemsMovedToLeft = finalLeft.filter(
      (item) =>
        !initialLeft.some((leftItem) => leftItem.username === item.username)
    );
    const itemsMovedToRight = finalRight.filter(
      (item) =>
        !initialRight.some((rightItem) => rightItem.username === item.username)
    );

    if (component === "users") {
      try {
        setLoading(true);
        if (itemsMovedToRight.length > 0) {
          itemsMovedToRight.map((item) => {
            const data = {
              project: id,
              user: item.id,
            };
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/user-projects/`,
                data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastMessage("Saving ..."));
                dispatch(settoastType("success"));
              });
          });
        }
        if (itemsMovedToLeft.length > 0) {
          itemsMovedToLeft.map((item) => {
            axios
              .get(
                `${
                  import.meta.env.VITE_API_DASHBOARD_URL
                }/user-projects/?project=${id}&user=${item.id}`
              )
              .then((res) => {
                const id = res.data[0].id;
                axios
                  .delete(
                    `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/user-projects/${id}/`
                  )
                  .then(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastMessage("Saving ..."));
                    dispatch(settoastType("success"));
                  })
                  .catch(() => {});
              });
          });
        }
        setTimeout(() => {
          setLoading(false);

          window.location.reload(true);
        }, 4000);
      } catch {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to Create User"));
        dispatch(settoastType("error"));
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
        <Button
          color="success"
          type="submit"
          onClick={handleSave}
          fullWidth
          variant={loading ? "outlined" : "contained"}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? null : "Save"}
          {loading ? <CircularProgress /> : null}
        </Button>
      </Grid>
    </Grid>
  );
}

UserTransferList.propTypes = {
  id: PropTypes.number,
  component: PropTypes.string,
};
