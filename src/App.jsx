import Routers from "./routes/Routers";
import "./App.css";
import Toast from "./components/Common/Toast";
import DeletePopup from "./components/Common/DeletePopup";

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
