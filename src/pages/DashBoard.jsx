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
  const user_id = useSelector((state) => state.auth.user_id);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/projects/?owner=${user_id}`
      )
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
