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

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({ project_id, component }) {
  const [checked, setChecked] = useState([]);
  const [finalLeft, setFinalLeft] = useState([]);
  const [finalRight, setFinalRight] = useState([]);
  const [InitialLeft, setInitialLeft] = useState([]);
  const [InitialRight, setInitialRight] = useState([]);
  const leftChecked = intersection(checked, InitialLeft);
  const rightChecked = intersection(checked, InitialRight);

  console.log(component, "component");

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
    setInitialRight(InitialRight.concat(leftChecked));
    setInitialLeft(not(InitialLeft, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setInitialLeft(InitialLeft.concat(rightChecked));
    setInitialRight(not(InitialRight, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    // Fetch data from the first API endpoint
    fetch(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-${component}/`)
      .then((response) => response.json())
      .then((data) => {
        const leftList = data.map((item) => item);

        // Fetch data from the second API endpoint
        fetch(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/${component}/?project=${project_id}`
        )
          .then((response) => response.json())
          .then((data) => {
            const rightList = data.map((item) => item);
            // Filter out items that are already in the rightList from the leftList
            const filteredLeftList = leftList.filter(
              (item) =>
                !rightList.some((rightItem) => rightItem.name === item.name)
            );
            const filteredRightList = leftList.filter((item) =>
              rightList.some((rightItem) => rightItem.name === item.name)
            );

            // setFinalLeft(filteredLeftList);
            setInitialLeft(filteredLeftList);
            setInitialRight(filteredRightList);
            // setFinalRight(rightList);
          });
      });
  }, [project_id, component]);

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
          console.log(value, "value");
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

              <ListItemText id={labelId} primary={value.full_name} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  //   const handleSave = () => {
  //     // Compare current lists with initial lists to track changes

  //     const itemsMovedToRight = finalLeft.filter(
  //       (item) => !Initialleft.some((leftItem) => leftItem.name === item.name)
  //     );
  //     const itemsMovedToLeft = finalRight.filter(
  //       (item) => !Initialright.some((rightItem) => rightItem.name === item.name)
  //     );

  //     if (component === "standard-category") {
  //       itemsMovedToRight.forEach((item) => {
  //         const data = {
  //           name: item.name,
  //           description: item.description,
  //           project: project_id,
  //           is_display: true,
  //         };
  //         axios
  //           .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`, data)
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });
  //       });

  //       itemsMovedToLeft.forEach((item) => {
  //         axios
  //           .delete(
  //             `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/${item.id}/`
  //           )
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });
  //       });
  //     }
  //     if (component === "sub-category") {
  //       itemsMovedToRight.forEach((item) => {
  //         axios
  //           .get(
  //             `${
  //               import.meta.env.VITE_API_DASHBOARD_URL
  //             }/standard-category/?project=${project_id}&name=${
  //               item.standard_category_name
  //             }`
  //           )
  //           .then((res) => {
  //             const standard_category = res.data[0].id;
  //             const data = {
  //               name: item.name,
  //               description: item.description,
  //               project: project_id,
  //               standard_category: standard_category,
  //               is_display: true,
  //             };
  //             axios
  //               .post(
  //                 `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`,
  //                 data
  //               )
  //               .then((res) => {
  //                 console.log(res);
  //               })
  //               .catch((error) => {
  //                 console.log(error);
  //               });
  //           });
  //       });

  //       itemsMovedToLeft.forEach((item) => {
  //         axios
  //           .delete(
  //             `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/${item.id}/`
  //           )
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });
  //       });
  //     }
  //     if (component === "category") {
  //       itemsMovedToRight.forEach((item) => {
  //         console.log(item, "item");
  //         // axios
  //         //   .get(
  //         //     `${
  //         //       import.meta.env.VITE_API_DASHBOARD_URL
  //         //     }/standard-category/?project=${project_id}&name=${
  //         //       item.standard_category_name
  //         //     }`
  //         //   )
  //         //   .then((res) => {
  //         //     const standard_category = res.data[0].id;
  //         //     const data = {
  //         //       name: item.name,
  //         //       description: item.description,
  //         //       project: project_id,
  //         //       standard_category: standard_category,
  //         //       is_display: true,
  //         //     };
  //         //     axios
  //         //       .post(
  //         //         `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`,
  //         //         data
  //         //       )
  //         //       .then((res) => {
  //         //         console.log(res);
  //         //       })
  //         //       .catch((error) => {
  //         //         console.log(error);
  //         //       });
  //         //   });
  //       });
  //       itemsMovedToLeft.forEach((item) => {
  //         console.log(item, "item");
  //       });
  //     }
  //   };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList("Choices", InitialLeft)}</Grid>
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
      <Grid item>{customList("Chosen", InitialRight)}</Grid>
      <Grid item>
        <Button
          // onClick={handleSave}
          variant="contained"
          color="success"
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

TransferList.propTypes = {
  project_id: PropTypes.number,
  component: PropTypes.string,
};
