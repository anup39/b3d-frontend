import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { PropTypes } from "prop-types";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import { Slider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { setCurrentMeasuringCategories } from "../../reducers/MapView";
import RectangleIcon from "@mui/icons-material/Rectangle";
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

export default function LayersPanel({ map, popUpRef }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(all_categories);
  const [loading, setLoading] = useState(true);
  // const client_id = useSelector((state) => state.mapCategories.client_id);
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );

  const current_measuring_categories = useSelector(
    (state) => state.mapView.currentMapDetail.current_measuring_categories
  );

  const project_id = useSelector(
    (state) => state.mapView.currentMapDetail.project_id
  );

  const mode = useSelector((state) => state.drawnPolygon.mode);
  const view_name = useSelector((state) => state.drawnPolygon.view_name);

  useEffect(() => {
    if (current_measuring_categories) {
      setCategories(current_measuring_categories);
      setLoading(false);
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/map-measurings/?client=${client_id}`
        )
        .then((res) => {
          dispatch(setCurrentMeasuringCategories(res.data));
          setLoading(false);
        });
    }
  }, [client_id, dispatch, current_measuring_categories]);

  useEffect(() => {
    const deepCopy = JSON.parse(JSON.stringify(current_measuring_categories));
    setCategories(deepCopy);
  }, [current_measuring_categories]);

  const handleChangesd = (event, sdIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].checked = event.target.checked;
    updatedCategories[sdIndex].indeterminate = false;
    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      sub.checked = event.target.checked;
      sub.indeterminate = false;
      sub.category.forEach((cat) => {
        cat.checked = event.target.checked;
        if (event.target.checked) {
          if (cat.type_of_geometry) {
            const sourceId = String(client_id) + cat.view_name + "source";
            const layerId = String(client_id) + cat.view_name + "layer";
            RemoveSourceAndLayerFromMap({
              map: map,
              layerId: layerId,
              sourceId: sourceId,
            });

            axios
              .get(
                `${
                  import.meta.env.VITE_API_DASHBOARD_URL
                }/category-style/?category=${cat.id}`
              )
              .then((response) => {
                const categoryStyle = response.data[0];
                let url = null;
                let fillType = null;
                if (cat.type_of_geometry === "Point") {
                  url = `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/category-point-geojson/?client=${client_id}&project=${
                    project_id === "All" ? "" : project_id
                  }&category=${cat.id}`;
                  fillType = "circle";
                }
                if (cat.type_of_geometry === "LineString") {
                  url = `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/category-linestring-geojson/?client=${client_id}&project=${
                    project_id === "All" ? "" : project_id
                  }&category=${cat.id}`;
                  fillType = "line";
                }
                if (cat.type_of_geometry === "Polygon") {
                  url = `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/category-polygon-geojson/?client=${client_id}&project=${
                    project_id === "All" ? "" : project_id
                  }&category=${cat.id}`;
                  fillType = "fill";
                }
                AddLayerAndSourceToMap({
                  map: map,
                  layerId: layerId,
                  sourceId: sourceId,
                  url: url,
                  source_layer: sourceId,
                  popUpRef: popUpRef,
                  showPopup: true,
                  style: {
                    fill_color: categoryStyle.fill,
                    fill_opacity: categoryStyle.fill_opacity,
                    stroke_color: categoryStyle.stroke,
                  },
                  zoomToLayer: false,
                  extent: [],
                  geomType: "geojson",
                  fillType: fillType,
                  trace: false,
                  component: "map",
                });
              });
          }
        } else {
          const sourceId = String(client_id) + cat.view_name + "source";
          const layerId = String(client_id) + cat.view_name + "layer";
          RemoveSourceAndLayerFromMap({
            map: map,
            layerId: layerId,
            sourceId: sourceId,
          });
        }
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
        console.log(cat, "category clicked in sub");
        if (cat.type_of_geometry) {
          cat.checked = event.target.checked;
          if (event.target.checked) {
            if (cat.type_of_geometry) {
              const sourceId = String(client_id) + cat.view_name + "source";
              const layerId = String(client_id) + cat.view_name + "layer";
              RemoveSourceAndLayerFromMap({
                map: map,
                layerId: layerId,
                sourceId: sourceId,
              });

              axios
                .get(
                  `${
                    import.meta.env.VITE_API_DASHBOARD_URL
                  }/category-style/?category=${cat.id}`
                )
                .then((response) => {
                  const categoryStyle = response.data[0];
                  let url = null;
                  let fillType = null;
                  if (cat.type_of_geometry === "Point") {
                    url = `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/category-point-geojson/?client=${client_id}&project=${
                      project_id === "All" ? "" : project_id
                    }&category=${cat.id}`;
                    fillType = "circle";
                  }
                  if (cat.type_of_geometry === "LineString") {
                    url = `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/category-linestring-geojson/?client=${client_id}&project=${
                      project_id === "All" ? "" : project_id
                    }&category=${cat.id}`;
                    fillType = "line";
                  }
                  if (cat.type_of_geometry === "Polygon") {
                    url = `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/category-polygon-geojson/?client=${client_id}&project=${
                      project_id === "All" ? "" : project_id
                    }&category=${cat.id}`;
                    fillType = "fill";
                  }
                  AddLayerAndSourceToMap({
                    map: map,
                    layerId: layerId,
                    sourceId: sourceId,
                    url: url,
                    source_layer: sourceId,
                    popUpRef: popUpRef,
                    showPopup: true,
                    style: {
                      fill_color: categoryStyle.fill,
                      fill_opacity: categoryStyle.fill_opacity,
                      stroke_color: categoryStyle.stroke,
                    },
                    zoomToLayer: false,
                    extent: [],
                    geomType: "geojson",
                    fillType: fillType,
                    trace: false,
                    component: "map",
                  });
                });
            }
          } else {
            const sourceId = String(client_id) + cat.view_name + "source";
            const layerId = String(client_id) + cat.view_name + "layer";
            RemoveSourceAndLayerFromMap({
              map: map,
              layerId: layerId,
              sourceId: sourceId,
            });
          }
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
    if (event.target.checked) {
      if (cat.type_of_geometry) {
        const sourceId = String(client_id) + cat.view_name + "source";
        const layerId = String(client_id) + cat.view_name + "layer";
        RemoveSourceAndLayerFromMap({
          map: map,
          layerId: layerId,
          sourceId: sourceId,
        });

        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/category-style/?category=${cat.id}`
          )
          .then((response) => {
            const categoryStyle = response.data[0];
            let url = null;
            let fillType = null;
            if (cat.type_of_geometry === "Point") {
              url = `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-point-geojson/?client=${client_id}&project=${
                project_id === "All" ? "" : project_id
              }&category=${cat.id}`;
              fillType = "circle";
            }
            if (cat.type_of_geometry === "LineString") {
              url = `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-linestring-geojson/?client=${client_id}&project=${
                project_id === "All" ? "" : project_id
              }&category=${cat.id}`;
              fillType = "line";
            }
            if (cat.type_of_geometry === "Polygon") {
              url = `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-polygon-geojson/?client=${client_id}&project=${
                project_id === "All" ? "" : project_id
              }&category=${cat.id}`;
              fillType = "fill";
            }
            AddLayerAndSourceToMap({
              map: map,
              layerId: layerId,
              sourceId: sourceId,
              url: url,
              source_layer: sourceId,
              popUpRef: popUpRef,
              showPopup: true,
              style: {
                fill_color: categoryStyle.fill,
                fill_opacity: categoryStyle.fill_opacity,
                stroke_color: categoryStyle.stroke,
              },
              zoomToLayer: false,
              extent: [],
              geomType: "geojson",
              fillType: fillType,
              trace: false,
              component: "map",
            });
          });
      }
    } else {
      const sourceId = String(client_id) + cat.view_name + "source";
      const layerId = String(client_id) + cat.view_name + "layer";
      RemoveSourceAndLayerFromMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
      });
    }

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
    const layerId = String(client_id) + cat.view_name + "layer";

    const style = map.getStyle();
    const existingLayer = style.layers.find((layer) => layer.id === layerId);

    if (existingLayer) {
      if (cat.type_of_geometry === "Polygon") {
        map.setPaintProperty(layerId, "fill-opacity", parseFloat(value));
      } else if (cat.type_of_geometry === "LineString") {
        map.setPaintProperty(layerId, "line-opacity", parseFloat(value));
      } else {
        map.setPaintProperty(layerId, "circle-opacity", parseFloat(value));
      }
    }
  };

  const handleZoomToLayer = (event, cat) => {
    map.fitBounds(cat.extent.extent);
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
        maxHeight: "80vh",
        minWidth: "19vw",
        margin: "10px",
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
                    backgroundColor: "#FFFFFF",
                    color: "black",
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
                  label={sd.label}
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
                      backgroundColor: "#FFFFFF",
                      color: "black",
                      marginRight: "4px",
                      padding: "2px",
                      "&:hover": {
                        // backgroundColor: "#9C27B0",
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
                    label={sub.label}
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
                        justifyContent: "space-between",
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
                        label={cat.label}
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

                      {cat.type_of_geometry === "LineString" ? (
                        <Tooltip title="Draw LineString">
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
                        <Tooltip title="Draw Polygon">
                          <RectangleIcon
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
                        <Tooltip title="Draw Point">
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
                      )}

                      <Tooltip title="Zoom to Layer">
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
