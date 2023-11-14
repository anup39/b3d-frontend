import { useState } from "react";
import { useParams } from "react-router-dom";
import AppBar from "../components/AppBar/AppBar";
import PropertyForm from "../components/PropertyForm/PropertyForm";
import UploadProgress from "../components/UploadProgress/UploadProgress";
import PropertyContainer from "../components/PropertyContainer/PropertyContainer";

export default function Properties() {
  const { client_id } = useParams();
  const { project_id } = useParams();
  const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const onProgressForm = (value) => {
    setIsProgressFormOpen(value);
  };

  const onProgressValue = (value) => {
    setProgress(value);
  };

  return (
    <>
      <AppBar></AppBar>

      <PropertyForm
        client_id={client_id}
        project_id={project_id}
        onProgressForm={onProgressForm}
        onProgressValue={onProgressValue}
      />
      <UploadProgress
        isProgressFormOpen={isProgressFormOpen}
        onProgressForm={onProgressForm}
        progress={progress}
      />

      <PropertyContainer project_id={project_id} />
    </>
  );
}
