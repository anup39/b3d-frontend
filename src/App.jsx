import Routers from "./routes/Routers";
import "./App.css";
import Toast from "./components/Common/Toast";
import DeleteUser from "./components/ManageUser/DeleteUser";
import DeletePopup from "./components/Common/DeletePopup";

function App() {
  return (
    <>
      {/* <MapProvider> */}
      <Toast />
      <DeletePopup />
      <DeleteUser />
      <Routers />
      {/* </MapProvider> */}
    </>
  );
}

export default App;
