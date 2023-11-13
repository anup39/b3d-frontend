import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import MapSection from "../pages/MapSection";
import Projects from "../pages/Projects";
import Register from "../pages/Register";
import Classification from "../pages/Classification";
import ManageClasses from "../pages/ManageClasses";
import Orthophotos from "../pages/Orthophotos";
import Mapgl from "../components/mapgl/Mapgl";
import Users from "../pages/Users";
import ManageProjects from "../pages/ManageProjects";
import ManageUsers from "../pages/ManageUsers";
import ManageStyles from "../pages/ManageStyles";
import Clients from "../pages/Clients";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/dashboard" element={<Clients />} />
        <Route exact path="/projects/:id" element={<Projects />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/class" element={<Classification />} />
        <Route exact path="/map/:id" element={<MapSection />} />
        <Route exact path="/manage-classes/:id" element={<ManageClasses />} />
        <Route exact path="/orthophotos/:id" element={<Orthophotos />} />
        <Route exact path="/mapgl" element={<Mapgl />} />
        <Route exact path="/users" element={<Users />} />
        <Route exact path="/manage-projects/:id" element={<ManageProjects />} />
        <Route exact path="/manage-users/:id" element={<ManageUsers />} />
        <Route exact path="/manage-styles/:id" element={<ManageStyles />} />
      </Routes>
    </Router>
  );
}
