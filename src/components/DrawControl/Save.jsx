import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPropertyPolygonGeojson,
  setshowMapLoader,
} from "../../reducers/MapView";
import axios from "axios";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";

export default function Save({ popUpRef }) {
  const dispatch = useDispatch();
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const type_of_geometry = useSelector(
    (state) => state.drawnPolygon.type_of_geometry
  );
  const currentClient = useSelector(
    (state) => state.client.clientDetail.client_id
  );
  const currentProject = useSelector((state) => state.project.project_id);
  const id = useSelector((state) => state.drawnPolygon.id);
  const feature_id = useSelector((state) => state.drawnPolygon.feature_id);

  const view_name = useSelector((state) => state.drawnPolygon.view_name);
  const mode = useSelector((state) => state.drawnPolygon.mode);
  const component = useSelector((state) => state.drawnPolygon.component);

  const handleSave = useCallback(() => {
    if (
      wkt_geometry &&
      type_of_geometry &&
      id &&
      view_name &&
      mode &&
      component
    ) {
      // dispatch(setshowGeomFormPopup("block"));
      if (mode === "Draw") {
        console.log("Draw mode");
        dispatch(setshowMapLoader(true));
        const selectedCategoryId = id;
        if (component === "project") {
          if (type_of_geometry === "Polygon") {
            const project_polygon_data = {
              client: parseInt(currentClient),
              project: parseInt(currentProject),
              geom: wkt_geometry,
              attributes: JSON.stringify({ name: view_name }),
              is_displayed: true,
            };
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/project-polygon/`,
                project_polygon_data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(
                  settoastMessage(
                    `Successfully created the Project Polygon of  ${currentProject}`
                  )
                );

                // Need to revise this logic
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const map = window.map_global;
                    const drawInstance = map.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));

                    // Here after the project polygon is created, we need to fetch the project polygon data and set it to the map
                    const layerId =
                      String(currentClient) + String(currentProject) + "layer";
                    const sourceId =
                      String(currentClient) + String(currentProject) + "source";
                    AddLayerAndSourceToMap({
                      map,
                      layerId: layerId,
                      sourceId: sourceId,
                      url: `${
                        import.meta.env.VITE_API_DASHBOARD_URL
                      }/project-polygon/?client=${currentClient}&project=${currentProject}`,
                      source_layer: sourceId,
                      popUpRef: popUpRef,
                      showPopup: true,
                      style: {
                        fill_color: "red",
                        fill_opacity: 0.5,
                        stroke_color: "red",
                        stroke_width: 2,
                      },
                      zoomToLayer: false,
                      extent: [],
                      geomType: "geojson",
                      fillType: "line",
                      trace: false,
                      component: "project-view",
                    });

                    axios
                      .get(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/project-polygon/?client=${currentClient}&project=${currentProject}`
                      )
                      .then((res) => {
                        const project_polygon_geojson = res.data;
                        dispatch(
                          setCurrentPropertyPolygonGeojson(
                            project_polygon_geojson
                          )
                        );
                      });
                  }
                }, 3000);
              })
              .catch(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("error"));
                dispatch(
                  settoastMessage("Failed to create the Project Polygon ")
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));
                  }
                }, 3000);
              });
          }
        } else if (component === "category") {
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category/${selectedCategoryId}/`
            )
            .then((res) => {
              const data = {
                client: parseInt(currentClient),
                project: parseInt(currentProject),
                standard_category: res.data.standard_category,
                sub_category: res.data.sub_category,
                category: selectedCategoryId,
                geom: wkt_geometry,
              };
              if (type_of_geometry === "Point") {
                axios
                  .post(
                    `${import.meta.env.VITE_API_DASHBOARD_URL}/point-data/`,
                    data
                  )
                  .then(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("success"));
                    dispatch(
                      settoastMessage(
                        `Successfully created the Category ${view_name}`
                      )
                    );
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const sourceId =
                          String(currentClient) + view_name + "source";
                        const layerId =
                          String(currentClient) + view_name + "layer";
                        const map = window.map_global;
                        if (map.getSource(sourceId) && map.getLayer(layerId)) {
                          const source = map.getSource(sourceId);
                          source.setData(
                            `${
                              import.meta.env.VITE_API_DASHBOARD_URL
                            }/category-point-geojson/?project=${currentProject}&category=${id}`
                          );
                        }
                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  })
                  .catch(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("error"));
                    dispatch(settoastMessage("Failed to create the Category"));
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  });
              }
              if (type_of_geometry === "LineString") {
                axios
                  .post(
                    `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/linestring-data/`,
                    data
                  )
                  .then(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("success"));
                    dispatch(
                      settoastMessage(
                        `Successfully created the Category ${view_name}`
                      )
                    );
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const sourceId =
                          String(currentClient) + view_name + "source";
                        const layerId =
                          String(currentClient) + view_name + "layer";
                        const map = window.map_global;
                        if (map.getSource(sourceId) && map.getLayer(layerId)) {
                          const source = map.getSource(sourceId);
                          source.setData(
                            `${
                              import.meta.env.VITE_API_DASHBOARD_URL
                            }/category-linestring-geojson/?project=${currentProject}&category=${id}`
                          );
                        }

                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  })
                  .catch(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("error"));
                    dispatch(settoastMessage("Failed to create the Category"));
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  });
              }
              if (type_of_geometry === "Polygon") {
                axios
                  .post(
                    `${import.meta.env.VITE_API_DASHBOARD_URL}/polygon-data/`,
                    data
                  )
                  .then(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("success"));
                    dispatch(
                      settoastMessage(
                        `Successfully created the Category ${view_name}`
                      )
                    );
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const sourceId =
                          String(currentClient) + view_name + "source";
                        const layerId =
                          String(currentClient) + view_name + "layer";
                        const map = window.map_global;
                        if (map.getSource(sourceId) && map.getLayer(layerId)) {
                          const source = map.getSource(sourceId);
                          source.setData(
                            `${
                              import.meta.env.VITE_API_DASHBOARD_URL
                            }/category-polygon-geojson/?project=${currentProject}&category=${id}`
                          );
                        }
                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  })
                  .catch(() => {
                    dispatch(setshowToast(true));
                    dispatch(settoastType("error"));
                    dispatch(settoastMessage("Failed to create the Category"));
                    setTimeout(() => {
                      dispatch(setshowMapLoader(false));
                      if (window.map_global) {
                        const drawInstance = window.map_global.draw;
                        drawInstance.deleteAll();
                        drawInstance.changeMode("simple_select");
                        dispatch(setWKTGeometry(null));
                        dispatch(setTypeOfGeometry(null));
                        dispatch(setId(null));
                        dispatch(setViewName(null));
                        dispatch(setMode(null));
                        dispatch(setFeatureId(null));
                        dispatch(setComponent(null));
                      }
                    }, 3000);
                  });
              }
            });
        }
      } else {
        console.log("Edit mode");
        dispatch(setshowMapLoader(true));
        // const selectedCategoryId = category_id;
        const data = {
          geom: wkt_geometry,
        };
        if (type_of_geometry === "Point") {
          axios
            .put(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/point-data/${feature_id}/`,
              data
            )
            .then(() => {
              dispatch(setshowToast(true));
              dispatch(settoastType("success"));
              dispatch(
                settoastMessage(
                  `Successfully updated the Category ${view_name}`
                )
              );
              setTimeout(() => {
                dispatch(setshowMapLoader(false));
                if (window.map_global) {
                  const sourceId = String(currentClient) + view_name + "source";
                  const layerId = String(currentClient) + view_name + "layer";
                  const map = window.map_global;
                  if (map.getSource(sourceId) && map.getLayer(layerId)) {
                    const source = map.getSource(sourceId);
                    source.setData(
                      `${
                        import.meta.env.VITE_API_DASHBOARD_URL
                      }/category-point-geojson/?project=${currentProject}&category=${id}`
                    );
                  }
                  if (mode === "Edit") {
                    map.setFilter(layerId, null);
                  }
                  const drawInstance = window.map_global.draw;
                  drawInstance.deleteAll();
                  drawInstance.changeMode("simple_select");
                  dispatch(setWKTGeometry(null));
                  dispatch(setTypeOfGeometry(null));
                  dispatch(setId(null));
                  dispatch(setViewName(null));
                  dispatch(setMode(null));
                  dispatch(setFeatureId(null));
                  dispatch(setComponent(null));
                }
              }, 3000);
            })
            .catch(() => {
              dispatch(setshowToast(true));
              dispatch(settoastType("error"));
              dispatch(settoastMessage("Failed to update the Category"));
              setTimeout(() => {
                dispatch(setshowMapLoader(false));
                if (window.map_global) {
                  const drawInstance = window.map_global.draw;
                  drawInstance.deleteAll();
                  drawInstance.changeMode("simple_select");
                  dispatch(setWKTGeometry(null));
                  dispatch(setTypeOfGeometry(null));
                  dispatch(setId(null));
                  dispatch(setViewName(null));
                  dispatch(setMode(null));
                  dispatch(setFeatureId(null));
                  dispatch(setComponent(null));
                }
              }, 3000);
            });
        }
        if (type_of_geometry === "LineString") {
          axios
            .put(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/linestring-data/${feature_id}/`,
              data
            )
            .then(() => {
              dispatch(setshowToast(true));
              dispatch(settoastType("success"));
              dispatch(
                settoastMessage(
                  `Successfully updated the Category ${view_name}`
                )
              );
              setTimeout(() => {
                dispatch(setshowMapLoader(false));
                if (window.map_global) {
                  const sourceId = String(currentClient) + view_name + "source";
                  const layerId = String(currentClient) + view_name + "layer";
                  const map = window.map_global;
                  if (map.getSource(sourceId) && map.getLayer(layerId)) {
                    const source = map.getSource(sourceId);
                    source.setData(
                      `${
                        import.meta.env.VITE_API_DASHBOARD_URL
                      }/category-linestring-geojson/?project=${currentProject}&category=${id}`
                    );
                  }
                  if (mode === "Edit") {
                    map.setFilter(layerId, null);
                  }
                  const drawInstance = window.map_global.draw;
                  drawInstance.deleteAll();
                  drawInstance.changeMode("simple_select");
                  dispatch(setWKTGeometry(null));
                  dispatch(setTypeOfGeometry(null));
                  dispatch(setId(null));
                  dispatch(setViewName(null));
                  dispatch(setMode(null));
                  dispatch(setFeatureId(null));
                  dispatch(setComponent(null));
                }
              }, 3000);
            })
            .catch(() => {
              dispatch(setshowToast(true));
              dispatch(settoastType("error"));
              dispatch(settoastMessage("Failed to update the Category"));
              setTimeout(() => {
                dispatch(setshowMapLoader(false));
                if (window.map_global) {
                  const drawInstance = window.map_global.draw;
                  drawInstance.deleteAll();
                  drawInstance.changeMode("simple_select");
                  dispatch(setWKTGeometry(null));
                  dispatch(setTypeOfGeometry(null));
                  dispatch(setId(null));
                  dispatch(setViewName(null));
                  dispatch(setMode(null));
                  dispatch(setFeatureId(null));
                  dispatch(setComponent(null));
                }
              }, 3000);
            });
        }
        if (type_of_geometry === "Polygon") {
          console.log(component, "component");
          if (component === "project") {
            axios
              .put(
                `${
                  import.meta.env.VITE_API_DASHBOARD_URL
                }/project-polygon/${feature_id}/`,
                data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(
                  settoastMessage(
                    `Successfully updated the  Project Polygon of  ${view_name}`
                  )
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const sourceId =
                      String(currentClient) + view_name + "source";
                    const layerId = String(currentClient) + view_name + "layer";
                    const map = window.map_global;
                    if (map.getSource(sourceId) && map.getLayer(layerId)) {
                      const source = map.getSource(sourceId);
                      source.setData(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/project-polygon/?client=${currentClient}&project=${currentProject}`
                      );
                    }
                    if (mode === "Edit") {
                      map.setFilter(layerId, null);
                    }
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));
                  }
                }, 3000);
              })
              .catch(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("error"));
                dispatch(
                  settoastMessage("Failed to update the Project Polygon")
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));
                  }
                }, 3000);
              });
          } else {
            axios
              .put(
                `${
                  import.meta.env.VITE_API_DASHBOARD_URL
                }/polygon-data/${feature_id}/`,
                data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(
                  settoastMessage(
                    `Successfully updated the Category ${view_name}`
                  )
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const sourceId =
                      String(currentClient) + view_name + "source";
                    const layerId = String(currentClient) + view_name + "layer";
                    const map = window.map_global;
                    if (map.getSource(sourceId) && map.getLayer(layerId)) {
                      const source = map.getSource(sourceId);
                      source.setData(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/category-polygon-geojson/?project=${currentProject}&category=${id}`
                      );
                    }
                    if (mode === "Edit") {
                      map.setFilter(layerId, null);
                    }
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));
                  }
                }, 3000);
              })
              .catch(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("error"));
                dispatch(settoastMessage("Failed to update the Category"));
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setId(null));
                    dispatch(setViewName(null));
                    dispatch(setMode(null));
                    dispatch(setFeatureId(null));
                    dispatch(setComponent(null));
                  }
                }, 3000);
              });
          }
        }
      }
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("error"));
      dispatch(
        settoastMessage(
          "No category drawn or edited in map. Please draw or edit category in Map"
        )
      );
    }
  }, [
    component,
    currentClient,
    currentProject,
    dispatch,
    feature_id,
    id,
    mode,
    popUpRef,
    type_of_geometry,
    view_name,
    wkt_geometry,
  ]);

  useEffect(() => {
    const map = window.map_global;
    if (map) {
      const keyDownHandler = (e) => {
        console.log(e.key);
        if (e.key === "Enter") {
          handleSave();
        }
      };
      window.addEventListener("keydown", keyDownHandler);
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [handleSave]);

  return (
    <div>
      <Tooltip title="Save">
        <IconButton
          onClick={handleSave}
          id="save-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Save"
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

Save.propTypes = {
  popUpRef: PropTypes.object,
};
