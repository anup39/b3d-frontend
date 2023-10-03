import { useRef } from "react";
import Map from "../map/Map";
import Search from "../components/Search/Search";
import { useParams } from "react-router-dom";

export default function MapSection() {
  const { id } = useParams();
  const searchRef = useRef(null);

  return (
    <div>
      <Map refObj={searchRef} />
      <div style={{ position: "absolute", top: "2vh", left: "2vw" }}>
        <Search refObj={searchRef} />
      </div>
    </div>
  );
}
