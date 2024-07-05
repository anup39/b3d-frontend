import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setprojects } from "../reducers/Project";
import AppBar from "../components/Common/AppBar";
import ProjectCard from "../components/Project/ProjectCard";
import ProjectForm from "../components/Project/ProjectForm";
import MapView from "../components/MapView/MapView";
import { Box, CircularProgress, Typography } from "@mui/material";
import { setClientDetail } from "../reducers/Client";
import {
  fetchClientDetailsByClientId,
  fetchProjectsByClientIdAndIds,
  fetchProjectsByClientId,
} from "../api/api";
import URL3d from "../components/Project/URL3d";
import IndoorForm from "../components/Project/IndoorForm";

export default function Projects() {
  const { client_id, view } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const group_name = useSelector((state) => state.auth.role.group_name);
  const projects_ = useSelector((state) => state.auth.role.project);
  // console.log("projects", projects);

  // const { data: projects } = useGetProjectsQuery(client);

  useEffect(() => {
    if (
      (group_name && group_name === "super_admin") ||
      group_name === "admin"
    ) {
      fetchProjectsByClientId(client_id).then((res) => {
        const updatedProjects = res.map((project) => {
          return {
            ...project,
            checked: false,
            openProperties: false,
          };
        });
        if (updatedProjects.length > 0) {
          dispatch(setprojects(updatedProjects));
        } else {
          dispatch(setprojects(null));
        }
      });
    }

    if (
      group_name === "editor" ||
      group_name === "viewer" ||
      group_name === "inspektor"
    ) {
      if (projects_.length > 0) {
        fetchProjectsByClientIdAndIds(client_id, projects_).then((res) => {
          const updatedProjects = res.map((project) => {
            return {
              ...project,
              checked: false,
              openProperties: false,
            };
          });
          if (updatedProjects.length > 0) {
            dispatch(setprojects(updatedProjects));
          } else {
            dispatch(setprojects(null));
          }
        });
      }
    }

    if (client_id) {
      fetchClientDetailsByClientId(client_id).then((res) => {
        const client_detail = {
          client_id: client_id,
          client_name: res.name,
          client_image: res.name.charAt(0).toUpperCase(),
        };

        dispatch(setClientDetail(client_detail));
      });
    }
  }, [dispatch, client_id, group_name, projects_]);

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
            {group_name === "super_admin" || group_name === "admin" ? (
              <>
                <ProjectForm client_id={client_id} />
                <URL3d client_id={client_id} />
                <IndoorForm client_id={client_id} />
              </>
            ) : null}
          </Box>

          {!projects ? (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
            >
              <Typography>No Properties</Typography>
            </Box>
          ) : null}

          {projects && projects.length === 0 ? (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CircularProgress></CircularProgress>
                <Typography>Loading</Typography>
              </Box>
            </Box>
          ) : null}

          <div>
            {projects && projects.length > 0
              ? projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    client_id={client_id}
                    id={project.id}
                    name={project.name}
                    client_name={project.client_name}
                    description={project.description}
                    url={project.url}
                    created_at={project.created_at}
                  />
                ))
              : null}
          </div>
        </div>
      ) : (
        <MapView />
      )}
    </>
  );
}
