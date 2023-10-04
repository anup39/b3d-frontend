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
  const [initialLeft, setInitialLeft] = useState([]);
  const [initialRight, setInitialRight] = useState([]);
  const leftChecked = intersection(checked, finalLeft);
  const rightChecked = intersection(checked, finalRight);

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
    fetch(
      `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/${component}/?project=${project_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        const rightList = data.map((item) => item);
        let global_url = `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/global-${component}/`;
        if (component === "sub-category") {
          const uniqueGlobalStandardCategories = [
            ...new Set(rightList.map((item) => item.global_standard_category)),
          ];
          let standardCategoryIds = "empty";
          if (uniqueGlobalStandardCategories.length > 0) {
            standardCategoryIds = uniqueGlobalStandardCategories.join(",");
          }
          global_url = `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/global-${component}/?standard_category_ids=${standardCategoryIds}`;
        }
        if (component === "category") {
          const uniqueGlobalStandardCategories = [
            ...new Set(rightList.map((item) => item.global_standard_category)),
          ];
          const uniqueGlobalSubCategories = [
            ...new Set(rightList.map((item) => item.global_sub_category)),
          ];
          let standardCategoryIds = "empty";
          let subCategoryIds = "empty";
          if (uniqueGlobalStandardCategories.length > 0) {
            standardCategoryIds = uniqueGlobalStandardCategories.join(",");
          }
          if (uniqueGlobalSubCategories.length > 0) {
            subCategoryIds = uniqueGlobalSubCategories.join(",");
          }
          global_url = `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/global-${component}/?standard_category_ids=${standardCategoryIds}&sub_category_ids=${subCategoryIds}`;
        }

        // Fetch data from the second API endpoint
        fetch(global_url)
          .then((response) => response.json())
          .then((data) => {
            const leftList = data.map((item) => item);
            // Filter out items that are already in the rightList from the leftList
            let filteredLeftList = leftList.filter(
              (item) =>
                !rightList.some(
                  (rightItem) => rightItem.full_name === item.full_name
                )
            );
            if (!rightList.length > 0 && component === "category-style") {
              filteredLeftList = [];
            }

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

  const handleSave = () => {
    // Compare current lists with initial lists to track changes
    const itemsMovedToLeft = finalLeft.filter(
      (item) => !initialLeft.some((leftItem) => leftItem.name === item.name)
    );
    const itemsMovedToRight = finalRight.filter(
      (item) => !initialRight.some((rightItem) => rightItem.name === item.name)
    );

    // if (component === "standard-category") {
    //   itemsMovedToRight.forEach((item) => {
    //     const data = {
    //       name: item.name,
    //       description: item.description,
    //       project: project_id,
    //       is_display: true,
    //     };
    //     axios
    //       .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`, data)
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   });

    //   itemsMovedToLeft.forEach((item) => {
    //     axios
    //       .delete(
    //         `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/${item.id}/`
    //       )
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   });
    // }
    // if (component === "sub-category") {
    //   itemsMovedToRight.forEach((item) => {
    //     axios
    //       .get(
    //         `${
    //           import.meta.env.VITE_API_DASHBOARD_URL
    //         }/standard-category/?project=${project_id}&name=${
    //           item.standard_category_name
    //         }`
    //       )
    //       .then((res) => {
    //         const standard_category = res.data[0].id;
    //         const data = {
    //           name: item.name,
    //           description: item.description,
    //           project: project_id,
    //           standard_category: standard_category,
    //           is_display: true,
    //         };
    //         axios
    //           .post(
    //             `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`,
    //             data
    //           )
    //           .then((res) => {
    //             console.log(res);
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       });
    //   });

    //   itemsMovedToLeft.forEach((item) => {
    //     axios
    //       .delete(
    //         `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/${item.id}/`
    //       )
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   });
    // }
    // if (component === "category") {
    //   itemsMovedToRight.forEach((item) => {
    //     console.log(item, "item");
    //     // axios
    //     //   .get(
    //     //     `${
    //     //       import.meta.env.VITE_API_DASHBOARD_URL
    //     //     }/standard-category/?project=${project_id}&name=${
    //     //       item.standard_category_name
    //     //     }`
    //     //   )
    //     //   .then((res) => {
    //     //     const standard_category = res.data[0].id;
    //     //     const data = {
    //     //       name: item.name,
    //     //       description: item.description,
    //     //       project: project_id,
    //     //       standard_category: standard_category,
    //     //       is_display: true,
    //     //     };
    //     //     axios
    //     //       .post(
    //     //         `${import.meta.env.VITE_API_DASHBOARD_URL}/${component}/`,
    //     //         data
    //     //       )
    //     //       .then((res) => {
    //     //         console.log(res);
    //     //       })
    //     //       .catch((error) => {
    //     //         console.log(error);
    //     //       });
    //     //   });
    //   });
    //   itemsMovedToLeft.forEach((item) => {
    //     console.log(item, "item");
    //   });
    // }
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

TransferList.propTypes = {
  project_id: PropTypes.number,
  component: PropTypes.string,
};
