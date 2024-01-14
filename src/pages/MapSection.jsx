import { useEffect } from "react";
import Map from "../map/Map";
import { useParams } from "react-router-dom";
import { setClient } from "../reducers/MapCategories";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "../components/Common/AppBar";
import CategoryGeomForm from "../components/Category/CategoryGeomForm";
import Map3D from "../map/Map3D";
// import ThreeScene from "../map/MapThree";
import MapLoader from "../components/MapLoader/MapLoader";

export default function MapSection() {
  const dispatch = useDispatch();
  const { level } = useParams();
  const { id } = useParams();
  const display_type = useSelector(
    (state) => state.mapView.currentMapDetail.display_type
  );

  const showMapLoader = useSelector((state) => state.mapView.showMapLoader);
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
