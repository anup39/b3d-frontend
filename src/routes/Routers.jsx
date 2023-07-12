import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        {/* <Route exact path="/dataset" element={<Dataset />} /> */}
      </Routes>
    </Router>
  );
}
