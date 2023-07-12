import { useRef } from "react";
import Map from "../map/Map";
import Search from "../components/Search/Search";

export default function MapSection() {
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
