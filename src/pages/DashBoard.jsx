import AppBar from "../components/AppBar/AppBar";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import ProjectForm from "../components/ProjectForm/ProjectForm";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setProjects } from "../reducers/Project";
import axios from "axios";

export default function DashBoard() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/`)
      .then((res) => {
        dispatch(setProjects(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

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
