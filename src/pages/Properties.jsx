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
import MapView from "../components/MapView/MapView";
import { setprojects } from "../reducers/Project";
import { setClientDetail } from "../reducers/Client";
import { setLevel } from "../reducers/MapView";
import {
  useGetProjectsByClientIdAndProjectIdQuery,
  useGetClientDetailsByClientIdQuery,
} from "../api/projectApi";

export default function Properties() {
  const { client_id, project_id, view } = useParams();
  const dispatch = useDispatch();
  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );
  const { data: projects } = useGetProjectsByClientIdAndProjectIdQuery({
    client_id,
    project_id,
  });
  const { data: clientData } = useGetClientDetailsByClientIdQuery(client_id);

  useEffect(() => {
    dispatch(setClientIdProperty(client_id));
    dispatch(setProjectIdProperty(project_id));
  }, [client_id, project_id, dispatch]);

  useEffect(() => {
    if (projects) {
      dispatch(setprojects(projects));
    }
    if (clientData) {
      const client_detail = {
        client_id: client_id,
        client_name: clientData.name,
        client_image: clientData.name.charAt(0).toUpperCase(),
      };
      dispatch(setClientDetail(client_detail));
    }
  }, [projects, dispatch, client_id, clientData]);

  useEffect(() => {
    dispatch(setLevel("Properties"));
  }, [dispatch]);

  return (
    <>
      {view === "List" ? (
        <>
          <AppBar></AppBar>
          <AddPropertyButton />
          {showTifUpload ? <UploadPropertyForm /> : null}
          {showProgressFormOpen ? <UploadProgress /> : null}
          <PropertyContainer project_id={project_id} />{" "}
        </>
      ) : (
        <MapView />
      )}
    </>
  );
}
