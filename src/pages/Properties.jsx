import { useParams } from "react-router-dom";
import AppBar from "../components/Common/AppBar";
import UploadProgress from "../components/Property/UploadProgress";
import PropertyContainer from "../components/Property/PropertyContainer";
import AddPropertyButton from "../components/Property/AddPropertyButton";
import UploadPropertyForm from "../components/Property/UploadPropertyForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setClientIdProperty,
  setProjectIdProperty,
} from "../reducers/Property";

export default function Properties() {
  const { client_id } = useParams();
  const { project_id } = useParams();
  const dispatch = useDispatch();
  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );

  useEffect(() => {
    dispatch(setClientIdProperty(client_id));
    dispatch(setProjectIdProperty(project_id));
  }, [client_id, project_id, dispatch]);

  return (
    <>
      <AppBar></AppBar>
      <AddPropertyButton />
      {showTifUpload ? <UploadPropertyForm /> : null}
      {showProgressFormOpen ? <UploadProgress /> : null}
      <PropertyContainer project_id={project_id} />
    </>
  );
}
