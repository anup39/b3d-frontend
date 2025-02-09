import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import { Slider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { setCurrentMeasuringCategories } from "../../reducers/Client";
// import RectangleIcon from "@mui/icons-material/Rectangle";
import PentagonIcon from "@mui/icons-material/Pentagon";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import all_categories from "./measurings_categories_sample";
import handleCategoriesChange from "../../maputils/handleCategoriesCheckedOrUnchecked";
import setGeometryOpacity from "../../maputils/handleGeometryOpacity";
import { fetchGeojsonByCategoryId } from "../../api/api";
import * as turf from "@turf/turf";
import {
  changeTableSummationData,
  changePieSummationData,
} from "../../reducers/MapView";
import { useTranslation } from "react-i18next";

export default function LayersPanel({ map, popUpRef }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(all_categories);
  const [loading, setLoading] = useState(true);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);
  const project_id = useSelector((state) => state.project.project_id);
  const { mode, view_name } = useSelector((state) => state.drawnPolygon);
  const current_measuring_categories = useSelector(
    (state) => state.client.current_measuring_categories
  );
  const group_name = useSelector((state) => state.auth.role.group_name);

  useEffect(() => {
    if (current_measuring_categories) {
      const deepCopy = JSON.parse(JSON.stringify(current_measuring_categories));
      setCategories(deepCopy);
      setLoading(false);
    }
  }, [current_measuring_categories]);

  const handlePieChartChange = (event, cat) => {
    console.log(event);
    console.log(cat);
    if (cat.type_of_geometry === "Polygon") {
      dispatch(
        changePieSummationData({ id: cat.id, checked: event.target.checked })
      );
    }
  };
  const handleTableChange = (event, cat) => {
    console.log(event);
    console.log(cat);
    dispatch(
      changeTableSummationData({ id: cat.id, checked: event.target.checked })
    );
  };

  const handleChangesd = (event, sdIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].checked = event.target.checked;
    updatedCategories[sdIndex].indeterminate = false;
    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      sub.checked = event.target.checked;
      sub.indeterminate = false;
      sub.category.forEach((cat) => {
        cat.checked = event.target.checked;
        handleCategoriesChange(
          event,
          cat,
          client_id,
          project_id,
          map,
          popUpRef
        );
        handlePieChartChange(event, cat);
        handleTableChange(event, cat);
      });
    });
    setCategories(updatedCategories);
    dispatch(setCurrentMeasuringCategories(updatedCategories));
  };

  // TODO: Here small issue , when the categories are empty for sub category , in this case when i selected any catgroy it will be automatically checked

  const handleChangesub = (event, sdIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].checked =
      event.target.checked;
    updatedCategories[sdIndex].sub_category[subIndex].indeterminate = false;

    updatedCategories[sdIndex].sub_category[subIndex].category.forEach(
      (cat) => {
        cat.checked = event.target.checked;
        if (cat.type_of_geometry) {
          cat.checked = event.target.checked;
          handleCategoriesChange(
            event,
            cat,
            client_id,
            project_id,
            map,
            popUpRef
          );
          handlePieChartChange(event, cat);
          handleTableChange(event, cat);
        }
      }
    );

    let allSubCategoriesChecked = true;
    let someSubCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      if (!sub.checked) {
        allSubCategoriesChecked = false;
      } else {
        someSubCategoriesChecked = true;
      }
    });

    updatedCategories[sdIndex].checked = allSubCategoriesChecked;
    updatedCategories[sdIndex].indeterminate =
      someSubCategoriesChecked && !allSubCategoriesChecked;

    // Check if all sub-categories are checked, then check the main category
    if (allSubCategoriesChecked) {
      updatedCategories[sdIndex].checked = true;
      updatedCategories[sdIndex].indeterminate = false;
    }

    setCategories(updatedCategories);
    dispatch(setCurrentMeasuringCategories(updatedCategories));
  };

  const handleChangecat = (event, sdIndex, subIndex, catIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].category[
      catIndex
    ].checked = event.target.checked;
    const cat =
      updatedCategories[sdIndex].sub_category[subIndex].category[catIndex];
    cat.checked = event.target.checked;
    handleCategoriesChange(event, cat, client_id, project_id, map, popUpRef);
    handlePieChartChange(event, cat);
    handleTableChange(event, cat);

    let allCategoriesChecked = true;
    let someCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category[subIndex].category.forEach(
      (cat) => {
        if (!cat.checked) {
          allCategoriesChecked = false;
        } else {
          someCategoriesChecked = true;
        }
      }
    );

    updatedCategories[sdIndex].sub_category[subIndex].checked =
      allCategoriesChecked;
    updatedCategories[sdIndex].sub_category[subIndex].indeterminate =
      someCategoriesChecked && !allCategoriesChecked;

    let someSubCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      let allSubCategoriesCheckedForSub = true;

      sub.category.forEach((cat) => {
        if (!cat.checked) {
          allSubCategoriesCheckedForSub = false;
        }
      });

      if (allSubCategoriesCheckedForSub) {
        sub.checked = true;
        sub.indeterminate = false;
      } else {
        sub.checked = false;
        someSubCategoriesChecked = true;
      }
    });

    updatedCategories[sdIndex].checked = !someSubCategoriesChecked;
    updatedCategories[sdIndex].indeterminate = someSubCategoriesChecked;

    // Check if none of the categories within a sub-category are checked
    let noCategoriesChecked = true;
    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      sub.category.forEach((cat) => {
        if (cat.checked) {
          noCategoriesChecked = false;
        }
      });
    });

    if (noCategoriesChecked) {
      updatedCategories[sdIndex].checked = false;
      updatedCategories[sdIndex].indeterminate = false;
    }

    setCategories(updatedCategories);
    dispatch(setCurrentMeasuringCategories(updatedCategories));
  };

  const handleChangeExpandSd = (event, sdIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].expand = !updatedCategories[sdIndex].expand;

    setCategories(updatedCategories);
    dispatch(setCurrentMeasuringCategories(updatedCategories));
  };

  const handleChangeExpandSub = (event, sdIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].expand =
      !updatedCategories[sdIndex].sub_category[subIndex].expand;
    setCategories(updatedCategories);
    dispatch(setCurrentMeasuringCategories(updatedCategories));
  };

  const handleChangeSlider = (event, value, cat) => {
    const style = map.getStyle();
    const layerId = String(client_id) + cat.view_name + "layer";
    const existingLayer = style.layers.find((layer) => layer.id === layerId);
    setGeometryOpacity(existingLayer, cat, map, layerId, value);
  };

  const handleZoomToLayer = (event, cat) => {
    fetchGeojsonByCategoryId({
      type_of_geometry: cat.type_of_geometry,
      client_id: client_id,
      project_id: project_id,
      category_id: cat.id,
    }).then((data) => {
      const bbox = turf.bbox(data);
      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: 20,
        }
      );
    });
  };

  const handleDraw = (event, cat) => {
    const draw = map.draw;
    draw.deleteAll();
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setId(null));
    dispatch(setViewName(null));
    dispatch(setFeatureId(null));
    dispatch(setComponent(null));

    if (mode && mode === "Edit") {
      const layerId = String(client_id) + view_name + "layer";
      map.setFilter(layerId, null);
    }
    const type_of_geometry = cat.type_of_geometry;
    if (type_of_geometry === "Polygon") {
      draw.changeMode("draw_polygon");
    }
    if (type_of_geometry === "LineString") {
      draw.changeMode("draw_line_string");
    }
    if (type_of_geometry === "Point") {
      draw.changeMode("draw_point");
    }
    dispatch(setId(cat.id));
    dispatch(setViewName(cat.view_name));
    dispatch(setMode("Draw"));
    dispatch(setComponent("category"));
  };

  return (
    <div
      style={{
        maxHeight: "50vh",
        minWidth: "400px",
        maxWidth: "650px",
        margin: "10px",
        overflowY: "scroll",
        backgroundColor: "white",
      }}
    >
      {!loading ? (
        categories &&
        categories.map((sd, sdIndex) => (
          <div key={sd.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExpandMoreIcon
                  sx={{
                    transform: sd.expand ? "rotate(360deg)" : "rotate(-90deg)",
                    fontSize: "20px",
                    backgroundColor: "white",
                    color: "#D51B60",
                    marginRight: "4px",
                    padding: "2px",
                    "&:hover": {
                      // backgroundColor: "#9C27B0",
                      cursor: "pointer",
                    },
                  }}
                  onClick={(event) => handleChangeExpandSd(event, sdIndex)}
                />
                <FormControlLabel
                  slotProps={{
                    typography: {
                      fontSize: 12,
                      color: "#6A6D70",
                      fontWeight: 900,
                    },
                  }}
                  label={sd.label.charAt(0).toUpperCase() + sd.label.slice(1)}
                  control={
                    <Checkbox
                      size="small"
                      checked={sd.checked}
                      indeterminate={sd.indeterminate}
                      onChange={(event) => handleChangesd(event, sdIndex)}
                    />
                  }
                />
              </Box>
            </Box>

            {sd.sub_category.map((sub, subIndex) => (
              <Box
                sx={{
                  display: sd.expand ? "flex" : "none",
                  flexDirection: "column",
                  ml: 3,
                }}
                key={sub.id}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ExpandMoreIcon
                    sx={{
                      transform: sub.expand
                        ? "rotate(360deg)"
                        : "rotate(-90deg)",
                      fontSize: "20px",
                      backgroundColor: "white",
                      color: "#D51B60",
                      marginRight: "4px",
                      padding: "2px",
                      "&:hover": {
                        backgroundColor: "#F5F5F5",
                        cursor: "pointer",
                      },
                    }}
                    onClick={(event) =>
                      handleChangeExpandSub(event, sdIndex, subIndex)
                    }
                  />
                  <FormControlLabel
                    slotProps={{
                      typography: {
                        fontSize: 12,
                        color: "#6A6D70",
                        fontWeight: 900,
                      },
                    }}
                    label={
                      sub.label.charAt(0).toUpperCase() + sub.label.slice(1)
                    }
                    control={
                      <Checkbox
                        size="small"
                        checked={sub.checked}
                        indeterminate={sub.indeterminate}
                        onChange={(event) =>
                          handleChangesub(event, sdIndex, subIndex)
                        }
                      />
                    }
                  />
                </Box>

                {sub.category.map((cat, catIndex) => (
                  <Box
                    sx={{
                      display: sub.expand ? "flex" : "none",
                      flexDirection: "column",
                      ml: 5,
                    }}
                    key={cat.id}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <FormControlLabel
                        slotProps={{
                          typography: {
                            fontSize: 12,
                            color: "#6A6D70",
                            fontWeight: 900,
                          },
                        }}
                        label={
                          cat.label.charAt(0).toUpperCase() + cat.label.slice(1)
                        }
                        control={
                          <Checkbox
                            sx={{
                              color: cat.fill_color,
                              "&.Mui-checked": {
                                color: cat.fill_color,
                              },
                            }}
                            size="small"
                            checked={cat.checked}
                            onChange={(event) =>
                              handleChangecat(
                                event,
                                sdIndex,
                                subIndex,
                                catIndex
                              )
                            }
                          />
                        }
                      />

                      <Slider
                        onChange={(event, value) =>
                          handleChangeSlider(event, value, cat)
                        }
                        step={0.1}
                        min={0}
                        max={1}
                        size="small"
                        defaultValue={cat.fill_opacity}
                        aria-label="Small"
                        sx={{ maxWidth: 100, margin: 2 }}
                        valueLabelDisplay="auto"
                      />

                      {/* <ModeIcon /> */}
                      {(group_name === "super_admin" ||
                        group_name === "admin" ||
                        group_name === "editor") &&
                      project_id !== "All" ? (
                        cat.type_of_geometry === "LineString" ? (
                          <Tooltip title={`${t("Draw")}` + " " + cat.name}>
                            <ShowChartIcon
                              onClick={(event) => handleDraw(event, cat)}
                              sx={{
                                marginRight: "10px",
                                backgroundColor: "#FFFFF",
                                color: cat.fill_color,
                                "&:hover": { cursor: "pointer" },
                              }}
                            />
                          </Tooltip>
                        ) : cat.type_of_geometry === "Polygon" ? (
                          <Tooltip title={`${t("Draw")}` + " " + cat.name}>
                            <PentagonIcon
                              size="small"
                              onClick={(event) => handleDraw(event, cat)}
                              sx={{
                                marginRight: "10px",
                                backgroundColor: "#FFFFF",
                                color: cat.fill_color,
                                "&:hover": { cursor: "pointer" },
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title={`${t("Draw")}` + " " + cat.name}>
                            <CircleIcon
                              onClick={(event) => handleDraw(event, cat)}
                              sx={{
                                marginRight: "10px",
                                backgroundColor: "#FFFFF",
                                color: cat.fill_color,
                                "&:hover": { cursor: "pointer" },
                              }}
                            />
                          </Tooltip>
                        )
                      ) : null}

                      <Tooltip title={t("Zoom")}>
                        <ZoomInIcon
                          onClick={(event) => handleZoomToLayer(event, cat)}
                          sx={{
                            marginLeft: "10px",
                            backgroundColor: "#FFFFF",
                            color: "#D61B60",
                            "&:hover": { cursor: "pointer" },
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </div>
        ))
      ) : (
        <Box sx={{ display: "flex", marginLeft: "50%" }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

LayersPanel.propTypes = {
  map: PropTypes.object,
  popUpRef: PropTypes.object,
};
