import { useEffect, useRef } from "react";
import Map from "../map/Map";
import Search from "../components/Search/Search";
import { useParams } from "react-router-dom";
import AppBar from "../components/AppBar/AppBar";
import axios from "axios";
import {
  setStandardCategories,
  setSubCategories,
  setCategories,
  setProjectName,
} from "../reducers/MapCategories";
import { useDispatch } from "react-redux";
import CategoryGeomForm from "../components/CategoryGeomForm/CategoryGeomForm";

export default function MapSection() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchRef = useRef(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/${id}/`)
      .then((res) => {
        const project_name = res.data.name;
        dispatch(setProjectName(project_name));
        axios
          .get(
            `${import.meta.env.VITE_API_DASHBOARD_URL}/category/?project=${id}`
          )
          .then((res) => {
            // const data = res.data;
            // console.log(data, "data");
            const data = res.data.map((item) => ({
              ...item,
              checked: false,
            }));
            dispatch(setCategories(data));
          });

        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/sub-category/?project=${id}`
          )
          .then((res) => {
            const data = res.data;
            dispatch(setSubCategories(data));
          });
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/standard-category/?project=${id}`
          )
          .then((res) => {
            const data = res.data;
            dispatch(setStandardCategories(data));
          });
      });
  }, [id, dispatch]);

  return (
    <div>
      <AppBar />
      <CategoryGeomForm project_id={id} />
      <Map refObj={searchRef} project_id={id} />
      <div style={{ position: "absolute", top: "10vh", right: "5vw" }}>
        <Search refObj={searchRef} />
      </div>
    </div>
  );
}
