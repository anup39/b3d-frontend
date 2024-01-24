import React from "react";
import { useParams } from "react-router-dom";
import Appbar from "../components/Common/AppBar";

const InspectionFlow = () => {
  const { client_id, project_id, inspection_id } = useParams();
  return (
    <>
      <Appbar />

      <h1>Inspection Flow</h1>
      <h2>Client ID: {client_id}</h2>
      <h2>Project ID: {project_id}</h2>
      <h2>Inspection ID: {inspection_id}</h2>
    </>
  );
};

export default InspectionFlow;
