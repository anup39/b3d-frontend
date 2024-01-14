import { useEffect, useRef } from "react";
import Map from "../map/Map";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  setStandardCategories,
  setSubCategories,
  setCategories,
  setProjectName,
  setClient,
} from "../reducers/MapCategories";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "../components/Common/AppBar";
import CategoryGeomForm from "../components/Category/CategoryGeomForm";
import TableMeasuringsForMap from "../components/TableMeasuringMapControl/TableMesuringsForMap";
import ReportPrint from "../components/MapView/ReportPrint";
import Map3D from "../map/Map3D";
import ThreeScene from "../map/MapThree";
import MapLoader from "../components/MapLoader/MapLoader";

export default function MapSection() {
  const dispatch = useDispatch();
  const { level } = useParams();
  const { id } = useParams();
  const display_type = useSelector(
    (state) => state.mapView.currentMapDetail.display_type
  );
  // const searchRef = useRef(null);

  const showMapLoader = useSelector((state) => state.mapView.showMapLoader);
  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/${level}s/${id}/`)
  //     .then((res) => {
  //       const project_name = res.data.name;
  //       dispatch(setProjectName(project_name));
  //       axios
  //         .get(
  //           `${import.meta.env.VITE_API_DASHBOARD_URL}/category/?${level}=${id}`
  //         )
  //         .then((res) => {
  //           const data = res.data.map((item) => ({
  //             ...item,
  //             checked: false,
  //           }));
  //           dispatch(setCategories(data));
  //         });

  //       axios
  //         .get(
  //           `${
  //             import.meta.env.VITE_API_DASHBOARD_URL
  //           }/sub-category/?${level}=${id}`
  //         )
  //         .then((res) => {
  //           const data = res.data;
  //           dispatch(setSubCategories(data));
  //         });
  //       axios
  //         .get(
  //           `${
  //             import.meta.env.VITE_API_DASHBOARD_URL
  //           }/standard-category/?${level}=${id}`
  //         )
  //         .then((res) => {
  //           const data = res.data;
  //           dispatch(setStandardCategories(data));
  //         });
  //     });
  // }, [id, level, dispatch]);

  useEffect(() => {
    if (level === "client") {
      dispatch(setClient(id));
    }
  }, [dispatch, level, id]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <AppBar />
      <CategoryGeomForm />
      {showMapLoader ? <MapLoader /> : null}

      {display_type && display_type === "2D" ? <Map id={id} /> : <Map3D />}

      {/* <ThreeScene /> */}
    </div>
  );
}
