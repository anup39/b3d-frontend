import AppBar from "../components/AppBar/AppBar";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import ProjectForm from "../components/ProjectForm/ProjectForm";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setProjects } from "../reducers/Project";
// import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export default function DashBoard() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const user_id = useSelector((state) => state.auth.user_id);

  useEffect(() => {
    axiosInstance
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"), // Include the API token from localStorage in the 'Authorization' header
        },
      })
      .then((res) => {
        dispatch(setProjects(res.data));
      });
  }, [user_id, dispatch]);

  return (
    <div>
      <AppBar />
      <ProjectForm />
      <div>
        {projects
          ? projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                created_at={project.created_at}
              />
            ))
          : null}
      </div>
    </div>
  );
}
