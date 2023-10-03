import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import MapSection from "../pages/MapSection";
import DashBoard from "../pages/DashBoard";
import Register from "../pages/Register";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/map/:id" element={<MapSection />} />
        <Route exact path="/dashboard" element={<DashBoard />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
