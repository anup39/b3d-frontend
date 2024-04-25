import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { fetchProjectsByClientId } from "../../api/api";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoleByUserId } from "../../api/api";
import Box from "@mui/material/Box";
import { setshowAssignPropertiesPopup } from "../../reducers/DisplaySettings";
import { CircularProgress } from "@mui/material";
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferListProject({ client_id }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [initialLeft, setInitialLeft] = React.useState([]);
  const [initialRight, setInitialRight] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const assignProperitesUser = useSelector(
    (state) => state.users.assignProperitesUser
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

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
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
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
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
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
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const handleSave = () => {
    if (
      JSON.stringify(left) !== JSON.stringify(initialLeft) ||
      JSON.stringify(right) !== JSON.stringify(initialRight)
    ) {
      // Save the changes
      console.log("Left or right items have changed. Saving changes...");
      // Update the initial state of the left and right lists
      setInitialLeft(left);
      setInitialRight(right);
    } else {
      console.log("Left or right items have not changed. No changes to save.");
      dispatch(setshowAssignPropertiesPopup(false));
    }
  };

  React.useEffect(() => {
    if (assignProperitesUser && client_id) {
      fetchRoleByUserId(assignProperitesUser.user).then((res) => {
        const projectSelected = res[0].project;
        console.log(projectSelected, "projectSelected");
        setRight(projectSelected);
        setInitialRight(projectSelected);
        fetchProjectsByClientId(client_id).then((res) => {
          const allProjects = res;
          const filteredProjects = allProjects.filter(
            (project) =>
              !projectSelected.some(
                (selectedProject) => selectedProject.id === project.id
              )
          );
          setLeft(filteredProjects);
          setInitialLeft(filteredProjects);
        });
      });
    }
  }, [client_id, assignProperitesUser]);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList("Choices", left)}</Grid>
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
      <Grid item>{customList("Chosen", right)}</Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            onClick={() => {
              handleSave();
            }}
            variant={loading ? "outlined" : "contained"}
          >
            {loading ? null : "Save"}
            {loading ? <CircularProgress /> : null}
          </Button>
          <Button
            sx={{
              backgroundColor: "red",
            }}
            variant="contained"
            onClick={() => {
              dispatch(setshowAssignPropertiesPopup(false));
            }}
          >
            Cancel
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

TransferListProject.propTypes = {
  client_id: PropTypes.string.isRequired,
};
