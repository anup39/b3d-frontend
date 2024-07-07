import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import MapSection from "../components/MapView/MapSection";
import Projects from "../pages/Projects";
import Classification from "../pages/Classification";
import InspectionTypes from "../pages/InspectionTypes";
import ManageClasses from "../pages/ManageClasses";
import Properties from "../pages/Properties";
import ManageUsers from "../pages/ManageUsers";
import ManageStyles from "../pages/ManageStyles";
import Clients from "../pages/Clients";
import ReportPrint from "../components/MapView/ReportPrint";
import Inspection from "../pages/Inspection";
import InspectionFlow from "../pages/InspectionFlow";
import InspectionReport from "../pages/InspectionReport";
import MainApp from "../pages/LayoutNew";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/layoutnew" element={<MainApp />} />
        <Route exact path="/" element={<Login />} />
        <Route exact path="/class" element={<Classification />} />
        <Route exact path="/inspection-type" element={<InspectionTypes />} />
        <Route exact path="/dashboard" element={<Clients />} />
        <Route exact path="/projects/:client_id/:view" element={<Projects />} />
        <Route
          exact
          path="/projects/:client_id/inspections/:project_id"
          element={<Inspection />}
        />
        <Route
          exact
          path="/projects/:client_id/inspections/:project_id/inspection/:inspection_id"
          element={<InspectionFlow />}
        />
        <Route
          exact
          path="/projects/:client_id/inspections/:project_id/inspection/:inspection_id/report"
          element={<InspectionReport />}
        />

        <Route
          exact
          path="/properties/:client_id/:project_id/:view"
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
        <Route exact path="/report" element={<ReportPrint />} />
      </Routes>
    </Router>
  );
}
