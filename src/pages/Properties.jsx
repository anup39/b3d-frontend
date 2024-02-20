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
import axios from "axios";
import { setprojects } from "../reducers/Project";
import { setClientDetail } from "../reducers/MapView";

export default function Properties() {
  const { client_id, project_id, view } = useParams();
  const dispatch = useDispatch();
  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );
  const projects = useSelector((state) => state.project.projects);

  useEffect(() => {
    dispatch(setClientIdProperty(client_id));
    dispatch(setProjectIdProperty(project_id));
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/projects/?client=${client_id}&id=${project_id}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        dispatch(setprojects(res.data));
      });

    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/${client_id}/`)
      .then((res) => {
        const client_detail = {
          client_id: client_id,
          client_name: res.data.name,
          client_image: res.data.name.charAt(0).toUpperCase(),
        };
        dispatch(setClientDetail(client_detail));
      });
  }, [client_id, project_id, dispatch]);

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
        <MapView
          level={"Properties"}
          client_id={client_id}
          projects={projects}
        />
      )}
    </>
  );
}
