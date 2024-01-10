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
  const handleSave = () => {
    if (wkt_geometry && type_of_geometry && category_id) {
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
                `${import.meta.env.VITE_API_DASHBOARD_URL}/polygon-data/`,
                data
              )
              .then(() => {
                setOpenCategoryStyleSuccessToast(true);
                setOpenCategoryStyleErrorToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleSuccessToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              })
              .catch(() => {
                setOpenCategoryStyleErrorToast(true);
                setOpenCategoryStyleSuccessToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleErrorToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              });
          }
          if (type_of_geometry === "LineString") {
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/polygon-data/`,
                data
              )
              .then(() => {
                setOpenCategoryStyleSuccessToast(true);
                setOpenCategoryStyleErrorToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleSuccessToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              })
              .catch(() => {
                setOpenCategoryStyleErrorToast(true);
                setOpenCategoryStyleSuccessToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleErrorToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              });
          }
          if (type_of_geometry === "Polygon") {
            console.log(data, "data for polygon");
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/polygon-data/`,
                data
              )
              .then(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(settoastMessage("Successfully created the Category"));
                setTimeout(() => {
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setCategoryId(null));
                  }
                }, 3000);
              })
              .catch(() => {
                dispatch(setshowToast(true));
                dispatch(settoastType("error"));
                dispatch(settoastMessage("Failed to create the Category"));
                setTimeout(() => {
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                    dispatch(setTypeOfGeometry(null));
                    dispatch(setCategoryId(null));
                  }
                }, 3000);
              });
          }
        });
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("error"));
      dispatch(
        settoastMessage("No category drawn in map. Please draw category")
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
