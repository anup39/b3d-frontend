import Routers from "./routes/Routers";
import "./App.css";
import { MapProvider } from "react-map-gl/maplibre";
import ErrorToast from "./components/Toast/ErrorToast";
import SucessToast from "./components/Toast/SucessToast";

function App() {
  return (
    <>
      {/* <MapProvider> */}
      <SucessToast />
      <Routers />
      {/* </MapProvider> */}
    </>
  );
}

export default App;
