import { useRef } from "react";
import Map from "../map/Map";
import Search from "../components/Search/Search";
import { useParams } from "react-router-dom";
import AppBar from "../components/AppBar/AppBar";
export default function MapSection() {
  const { id } = useParams();
  const searchRef = useRef(null);

  return (
    <div>
      <AppBar />
      <Map refObj={searchRef} project_id={id} />
      <div style={{ position: "absolute", top: "10vh", right: "5vw" }}>
        <Search refObj={searchRef} />
      </div>
    </div>
  );
}
