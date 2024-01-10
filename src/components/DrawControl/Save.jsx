import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import { setshowMapLoader } from "../../reducers/MapView";
import axios from "axios";
import {
  setCategoryId,
  setCategoryViewName,
  setTypeOfGeometry,
  setWKTGeometry,
} from "../../reducers/DrawnGeometry";

export default function Save() {
  const dispatch = useDispatch();
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const type_of_geometry = useSelector(
    (state) => state.drawnPolygon.type_of_geometry
  );
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const project_id = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );
  const category_id = useSelector((state) => state.drawnPolygon.category_id);
  const category_view_name = useSelector(
    (state) => state.drawnPolygon.category_view_name
  );

  const handleSave = () => {
    if (wkt_geometry && type_of_geometry && category_id && category_view_name) {
      // dispatch(setshowGeomFormPopup("block"));
      dispatch(setshowMapLoader(true));
      const selectedCategoryId = category_id;
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/category/${selectedCategoryId}/`
        )
        .then((res) => {
          const data = {
            client: parseInt(client_id),
            project: parseInt(project_id),
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
                    `Successfully created the Category ${category_view_name}`
                  )
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const sourceId =
                      String(client_id) + category_view_name + "source";
                    const layerId =
                      String(client_id) + category_view_name + "layer";
                    const map = window.map_global;
                    if (map.getSource(sourceId) && map.getLayer(layerId)) {
                      const source = map.getSource(sourceId);
                      source.setData(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/category-point-geojson/?project=${project_id}&category=${category_id}`
                      );
                    }
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
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
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
                  }
                }, 3000);
              });
          }
          if (type_of_geometry === "LineString") {
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/linestring-data/`,
                data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(
                  settoastMessage(
                    `Successfully created the Category ${category_view_name}`
                  )
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const sourceId =
                      String(client_id) + category_view_name + "source";
                    const layerId =
                      String(client_id) + category_view_name + "layer";
                    const map = window.map_global;
                    if (map.getSource(sourceId) && map.getLayer(layerId)) {
                      const source = map.getSource(sourceId);
                      source.setData(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/category-linestring-geojson/?project=${project_id}&category=${category_id}`
                      );
                    }
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
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
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
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
                    `Successfully created the Category ${category_view_name}`
                  )
                );
                setTimeout(() => {
                  dispatch(setshowMapLoader(false));
                  if (window.map_global) {
                    const sourceId =
                      String(client_id) + category_view_name + "source";
                    const layerId =
                      String(client_id) + category_view_name + "layer";
                    const map = window.map_global;
                    if (map.getSource(sourceId) && map.getLayer(layerId)) {
                      const source = map.getSource(sourceId);
                      source.setData(
                        `${
                          import.meta.env.VITE_API_DASHBOARD_URL
                        }/category-polygon-geojson/?project=${project_id}&category=${category_id}`
                      );
                    }
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
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
                    dispatch(setCategoryId(null));
                    dispatch(setCategoryViewName(null));
                  }
                }, 3000);
              });
          }
        });
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("error"));
      dispatch(
        settoastMessage(
          "No category drawn or edited in map. Please draw or edit category in Map"
        )
      );
    }
  };
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
