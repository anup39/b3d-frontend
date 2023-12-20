import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import MapSection from "../pages/MapSection";
import Projects from "../pages/Projects";
import Classification from "../pages/Classification";
import ManageClasses from "../pages/ManageClasses";
import Properties from "../pages/Properties";
import ManageUsers from "../pages/ManageUsers";
import ManageStyles from "../pages/ManageStyles";
import Clients from "../pages/Clients";
import MiniDrawer from "../components/SiderBar/SideBar";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/class" element={<Classification />} />
        <Route exact path="/dashboard" element={<Clients />} />
        <Route exact path="/projects/:client_id" element={<Projects />} />
        <Route
          exact
          path="/properties/:client_id/:project_id"
          element={<Properties />}
        />
        <Route exact path="/map/:level/:id" element={<MapSection />} />
        <Route
          exact
          path="/manage-classes/:client_id"
          element={<ManageClasses />}
        />
        <Route
          exact
          path="/manage-users/:client_id"
          element={<ManageUsers />}
        />
        <Route exact path="/manage-styles/:id" element={<ManageStyles />} />
        <Route exact path="/map-test" element={<MiniDrawer />} />
      </Routes>
    </Router>
  );
}
