import Routers from "./routes/Routers";
import "./App.css";
import { MapProvider } from "react-map-gl/maplibre";

function App() {
  return (
    <>
      {/* <MapProvider> */}
      <Routers />
      {/* </MapProvider> */}
    </>
  );
}

export default App;
