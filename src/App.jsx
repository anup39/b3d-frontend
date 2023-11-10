import Routers from "./routes/Routers";
import "./App.css";
import { MapProvider } from "react-map-gl/maplibre";
import Toast from "./components/Toast/Toast";
import DeletePopup from "./components/DeletePopup/DeletePopup";

function App() {
  return (
    <>
      {/* <MapProvider> */}
      <Toast />
      <DeletePopup />
      <Routers />
      {/* </MapProvider> */}
    </>
  );
}

export default App;
