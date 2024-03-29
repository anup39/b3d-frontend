import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setprojects } from "../reducers/Project";
import AppBar from "../components/Common/AppBar";
import ProjectCard from "../components/Project/ProjectCard";
import ProjectForm from "../components/Project/ProjectForm";
import MapView from "../components/MapView/MapView";
import { Box } from "@mui/material";
import { setClientDetail } from "../reducers/MapView";
import {
  useGetProjectsByClientIdQuery,
  useGetClientDetailsByClientIdQuery,
} from "../api/projectApi";

export default function Projects() {
  const { client_id, view } = useParams();
  const dispatch = useDispatch();

  const { data: projects } = useGetProjectsByClientIdQuery(client_id);
  const { data: clientData } = useGetClientDetailsByClientIdQuery(client_id);

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
  }, [projects, clientData, dispatch, client_id]);

  return (
    <>
      {view === "List" ? (
        <div>
          <AppBar />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ProjectForm client_id={client_id} />
          </Box>

          <div>
            {projects
              ? projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    client_id={client_id}
                    id={project.id}
                    name={project.name}
                    client_name={project.client_name}
                    description={project.description}
                    created_at={project.created_at}
                  />
                ))
              : null}
          </div>
        </div>
      ) : (
        <MapView level={"Projects"} client_id={client_id} />
      )}
    </>
  );
}
