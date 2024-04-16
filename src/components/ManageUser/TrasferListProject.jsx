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
  console.log(client_id, "client_id");
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([
    { id: 1, name: "test" },
    { id: 2, name: "new test" },
    { id: 3, name: "test 3" },
  ]);
  const [right, setRight] = React.useState([
    {
      id: 4,
      name: "test 4",
    },
    {
      id: 5,
      name: "test 5",
    },
    {
      id: 6,
      name: "test 6",
    },
  ]);

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
    console.log(right, "right");
  };

  React.useEffect(() => {
    if (assignProperitesUser) {
      fetchRoleByUserId(assignProperitesUser.user).then((res) => {
        console.log(res[0].project, "res selected");
      });
    }
    if (!client_id) return;
    fetchProjectsByClientId(client_id).then((res) => {
      console.log(res, "res all");
      setLeft(res);
    });
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
      <Button
        variant="contained"
        sx={{
          backgroundColor: "blue",
        }}
        onClick={() => {
          handleSave();
          // dispatch(setshowAssignPropertiesPopup(false));
        }}
      >
        Save
      </Button>
      <Button
        sx={{
          backgroundColor: "red",
        }}
        variant="contained"
        onClick={() => {
          // dispatch(setshowAssignPropertiesPopup(false));
        }}
      >
        Cancel
      </Button>
    </Grid>
  );
}

TransferListProject.propTypes = {
  client_id: PropTypes.string.isRequired,
};
