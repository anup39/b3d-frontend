import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, IconButton } from "@mui/material";
import axios from "axios";
import { setshowMapLoader } from "../../reducers/MapView";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import { RootState } from "../../store";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { Box, Link, Typography } from "@mui/material";
import React from "react";

declare global {
  interface Window {
    map_global: any;
  }
}

interface PopupProps {
  properties: {
    [key: string]: string | number;
    id: number;
    mill_name: string;
    mill_eq_id: string;
    mill_long: string;
    mill_lat: string;
  };
  feature_id: number;
  features: any;
}

const Popup = ({ properties, feature_id, features }: PopupProps) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // const state = useSelector((state) => state.drawnPolygon);
  const client_id = useSelector(
    (state: RootState) => state.client.clientDetail.client_id
  );
  const project_id = useSelector(
    (state: RootState) => state.project.project_id
  );
  const current_measuring_categories = useSelector(
    (state: RootState) => state.client.current_measuring_categories
  );

  const id = useSelector((state: RootState) => state.drawnPolygon.id);
  const view_name = useSelector(
    (state: RootState) => state.drawnPolygon.view_name
  );
  const group_name = useSelector((state) => state.auth.role.group_name);

  const propertyElements = properties
    ? Object.entries(properties)
        .filter(
          ([key]) =>
            key !== "category" &&
            key !== "category_id" &&
            key !== "property" &&
            key !== "type_of_geometry" &&
            key !== "component"
        ) // Exclude 'perimeter' and 'area'
        .map(([key, value]) => {
          console.log(key, "key");
          const language = localStorage.getItem("i18nextLng");
          if (key === "view_name") {
            if (language === "en") {
              key = "Category";
            } else key = "Kategori";
          }
          if (key === "area") {
            if (language === "en") {
              key = "Area";
            } else key = "Areal";
          }
          if (key === "perimeter") {
            if (language === "en") {
              key = "Perimeter";
            } else key = "Omkrets";
          }
          if (key === "length") {
            if (language === "en") {
              key = "Length";
            } else key = "Lengde";
          }
          return (
            <div key={key}>
              {key !== "extra_fields" && key !== "extra_fields_value" ? (
                <>
                  {" "}
                  <strong>{key}:</strong> {value}
                </>
              ) : null}
            </div>
          );
        })
    : null;

  const handleDeleteCategory = (properties, feature_id) => {
    dispatch(setshowMapLoader(true));
    if (properties.type_of_geometry === "Polygon") {
      axios
        .delete(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/polygon-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-polygon-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    } else if (properties.type_of_geometry === "LineString") {
      axios
        .delete(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/linestring-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-linestring-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    } else {
      axios
        .delete(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/point-data/${feature_id}/`
        )
        .then((res) => {
          dispatch(setshowMapLoader(false));
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            const popups = document.getElementsByClassName("maplibregl-popup");

            if (popups.length) {
              popups[0].remove();
            }
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-point-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
          }
        });
    }
  };
  const handleEditCategory = () => {
    // First remove the popup content
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    // Here now get the map object and then get the draw object and delete all the layers in draw and add the current features to the draw object
    const map = window.map_global;
    const draw = map.draw;
    draw.deleteAll();
    draw.add(features[0]);

    // Here setting the state of the draw object in drawPolygon

    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setMode("Edit"));
    dispatch(setFeatureId(feature_id));
    dispatch(setComponent(properties.component));
    dispatch(setViewName(properties.view_name));
    if (properties.component === "category") {
      dispatch(setId(properties.category_id));
    } else {
      dispatch(setId(properties.project_id));
    }

    //Note: Here i have to find if the clicked featue is of category or project
    if (view_name) {
      const layerId = String(client_id) + view_name + "layer";
      map.setFilter(layerId, null);
    }
    const layerId = String(client_id) + properties.view_name + "layer";
    map.setFilter(layerId, null);
    const layer = map.getLayer(layerId);
    const existingFilter = layer.filter || ["all"];
    const filterCondition = ["!=", ["id"], feature_id];
    const updatedFilter = ["all", existingFilter, filterCondition];
    map.setFilter(layerId, updatedFilter);
    // Loop through the elements and hide them
  };

  useEffect(() => {
    if (client_id) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/category/?client=${parseInt(client_id)}&type_of_geometry=${
            properties.type_of_geometry
          }`
        )
        .then((response) => {
          setOptions(response.data);
          setValue(
            response.data.find(
              (option) => option.id === properties.category_id
            ) || null
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [client_id]);

  const handleSaveCategory = () => {
    console.log(value, "value");
    console.log(feature_id, "feature_id");
    const data = {
      standard_category: value.standard_category,
      sub_category: value.sub_category,
      category: value.id,
      global_category: value.global_category,
      standard_category_name: value.standard_category_name,
      sub_category_name: value.sub_category_name,
      category_name: value.name,
    };
    setLoading(true);
    if (properties.type_of_geometry === "Polygon") {
      axios
        .patch(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/polygon-data/${feature_id}/`,
          data
        )
        .then((res) => {
          console.log(res, "res");
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-polygon-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
            setLoading(false);
          }
          const sourceId_new = String(client_id) + value.view_name + "source";
          const layerId_new = String(client_id) + value.view_name + "layer";
          if (map.getSource(sourceId_new) && map.getLayer(layerId_new)) {
            const source_new = map.getSource(sourceId_new);
            source_new.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-polygon-geojson/?project=${project_id}&category=${
                value.id
              }`
            );
          }
        });
    }
    if (properties.type_of_geometry === "LineString") {
      axios
        .patch(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/linestring-data/${feature_id}/`,
          data
        )
        .then((res) => {
          console.log(res, "res");
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-linestring-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
            setLoading(false);
          }
          const sourceId_new = String(client_id) + value.view_name + "source";
          const layerId_new = String(client_id) + value.view_name + "layer";
          if (map.getSource(sourceId_new) && map.getLayer(layerId_new)) {
            const source_new = map.getSource(sourceId_new);
            source_new.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-linestring-geojson/?project=${project_id}&category=${
                value.id
              }`
            );
          }
        });
    }
    if (properties.type_of_geometry === "Point") {
      axios
        .patch(
          `${import.meta.env.VITE_API_DASHBOARD_URL}/point-data/${feature_id}/`,
          data
        )
        .then((res) => {
          console.log(res, "res");
          const sourceId = String(client_id) + properties.view_name + "source";
          const layerId = String(client_id) + properties.view_name + "layer";
          const map = window.map_global;
          if (map.getSource(sourceId) && map.getLayer(layerId)) {
            const source = map.getSource(sourceId);
            source.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-point-geojson/?project=${project_id}&category=${
                properties.category_id
              }`
            );
            setLoading(false);
          }
          const sourceId_new = String(client_id) + value.view_name + "source";
          const layerId_new = String(client_id) + value.view_name + "layer";
          if (map.getSource(sourceId_new) && map.getLayer(layerId_new)) {
            const source_new = map.getSource(sourceId_new);
            source_new.setData(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-point-geojson/?project=${project_id}&category=${
                value.id
              }`
            );
          }
        });
    }
  };

  console.log(properties.extra_fields, "properties");
  console.log(properties.extra_fields_value, "properties");

  const extra_fields = JSON.parse(properties.extra_fields);
  const extra_fields_value = extra_fields;

  console.log(options, "options");

  const handleSubmtitEditAlternative = (e) => {
    e.preventDefault();
    console.log("submitting form");
  };
  return (
    <>
      {properties ? (
        <div>
          <div>{propertyElements}</div>

          {extra_fields?.length > 0 ? (
            <form onSubmit={handleSubmtitEditAlternative}>
              <Typography variant="body2" gutterBottom>
                <b>{t("Additional")}</b>
              </Typography>
              {extra_fields?.map((field) => {
                const id = field.id;

                switch (field.type) {
                  case "Text":
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{field.label} </Typography>:
                        <input
                          value={
                            extra_fields_value.find((item) => item.id === id)
                              ? extra_fields_value.find(
                                  (item) => item.id === id
                                ).value
                              : ""
                          }
                          placeholder="Enter value"
                        />
                      </Box>
                    );
                  case "Checkbox":
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography>{field.label}:</Typography>
                        <input
                          type="checkbox"
                          checked={
                            extra_fields_value.find((item) => item.id === id)
                              ? extra_fields_value.find(
                                  (item) => item.id === id
                                ).value
                              : false
                          }
                        />
                      </Box>
                    );
                  case "Url":
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginButtom: "20px",
                        }}
                      >
                        <Typography>{field.label}:</Typography>
                        <input
                          value={
                            extra_fields_value.find((item) => item.id === id)
                              ? extra_fields_value.find(
                                  (item) => item.id === id
                                ).value
                              : ""
                          }
                          placeholder="Enter value"
                        ></input>
                      </Box>
                    );
                  case "Number":
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginButtom: "20px",
                        }}
                        key={id}
                      >
                        <Typography>{field.label}</Typography>
                        <input
                          type="number"
                          value={
                            extra_fields_value.find((item) => item.id === id)
                              ? extra_fields_value.find(
                                  (item) => item.id === id
                                ).value
                              : ""
                          }
                          placeholder="Enter value"
                        ></input>
                      </Box>
                    );
                  case "Dropdown":
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Typography>{field.label}:</Typography>
                        {/* {field.value && field.value.length > 0
                          ? field.value.map((item, index) => {
                              return item.selected ? (
                                <Typography key={index}>
                                  {item.value}
                                </Typography>
                              ) : null;
                            })
                          : null} */}

                        <select>
                          <option value="">--select an option--</option>
                          {field.value && field.value.length > 0
                            ? field.value.map((item, index) => {
                                return (
                                  <option
                                    selected={
                                      extra_fields_value.find(
                                        (i) => i.id === id
                                      )
                                        ? extra_fields_value
                                            .find((i) => i.id === id)
                                            .value.find((j) => item.id === j.id)
                                            .selected
                                        : false
                                    }
                                    key={index}
                                    value={item.value}
                                  >
                                    {item.value}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </Box>
                    );

                  default:
                    return null;
                }
              })}
              <Button type="submit" variant="contained">
                Edit Alternative
              </Button>
            </form>
          ) : null}

          <br></br>
          {group_name === "super_admin" ||
          group_name === "admin" ||
          group_name === "editor" ||
          (group_name === "inspektor" && project_id !== "All") ? (
            <>
              <div style={{ display: "flex" }}>
                <Autocomplete
                  size="small"
                  disablePortal
                  id="autocomplete-category"
                  options={options}
                  getOptionLabel={(option) =>
                    option.sub_category_name.charAt(0).toUpperCase() +
                    option.sub_category_name.slice(1) +
                    " | " +
                    option.name
                  }
                  sx={{ width: 200 }}
                  value={value}
                  onChange={(event: any, newValue: string | null) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ fontFamily: "Roboto", fontSize: "5px" }}
                      label={t("Category")}
                      // value={properties.name}
                    />
                  )}
                />

                {loading ? (
                  <CircularProgress sx={{ p: 1 }} size={40} />
                ) : (
                  <Tooltip title={t("Save") + " " + t("Category")}>
                    <IconButton onClick={handleSaveCategory}>
                      <CheckCircleIcon
                        sx={{
                          backgroundColor: "white",
                          color: "#D51B60",
                          "&:hover": {
                            backgroundColor: "black",
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </div>

              <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: "#D51B60",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                  onClick={() => handleDeleteCategory(properties, feature_id)}
                >
                  {t("Delete")}
                </Button>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: "#D51B60",
                    color: "white",

                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                  onClick={() => handleEditCategory()}
                >
                  {t("Edit")}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Popup;
