import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setprojects } from "../reducers/Project";
import axios from "axios";
import AppBar from "../components/Common/AppBar";
import ProjectCard from "../components/Project/ProjectCard";
import ProjectForm from "../components/Project/ProjectForm";
import MapView from "../components/MapView/MapView";
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MapIcon from "@mui/icons-material/Map";
import { setClientDetail } from "../reducers/MapView";

export default function Projects() {
  const navigate = useNavigate();
  const { client_id, view } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const user_id = useSelector((state) => state.auth.user_id);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/projects/?client=${client_id}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        dispatch(setprojects(res.data));
      });

    // Gettings client_id , client_name and client logo for state
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
  }, [client_id, user_id, dispatch]);

  const handleViewInMap = () => {
    // #use client id
    navigate(`/projects/${client_id}/Map`);
  };

  return (
    <>
      {view === "List" ? (
        <div>
          <AppBar />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
            }}
          >
            <ProjectForm client_id={client_id} />
            <Tooltip title="MapView">
              <MapIcon
                onClick={handleViewInMap}
                sx={{ "&:hover": { cursor: "pointer" }, mr: 1 }}
              />
            </Tooltip>
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
        <MapView client_id={client_id} projects={projects} />
      )}
    </>
  );
}
