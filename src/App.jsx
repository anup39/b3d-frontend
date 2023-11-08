import Routers from "./routes/Routers";
import "./App.css";
import { MapProvider } from "react-map-gl/maplibre";
import Toast from "./components/Toast/Toast";

function App() {
  return (
    <>
      {/* <MapProvider> */}
      <Toast />
      <Routers />
      {/* </MapProvider> */}
    </>
  );
}

export default App;
