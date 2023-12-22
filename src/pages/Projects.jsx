import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setprojects } from "../reducers/Project";
import axios from "axios";
import AppBar from "../components/Common/AppBar";
import ProjectCard from "../components/Project/ProjectCard";
import ProjectForm from "../components/Project/ProjectForm";

export default function Projects() {
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
  }, [client_id, user_id, dispatch]);

  return (
    <>
      {view === "List" ? (
        <div>
          <AppBar />
          <ProjectForm client_id={client_id} />
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
        <div>Test</div>
      )}
    </>
  );
}
