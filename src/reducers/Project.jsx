import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";

const initialState = {
  project_id: null,
  current_project_name: null,
  projects: [],
  originalProjects: [],
  openEditProjectForm: false,
  editProjectId: null,
  openIndoorForm: false,
  editIndoorProjectId: null,
  indoors: [],
};

export const Project = createSlice({
  name: "Project",
  initialState,
  reducers: {
    setcurrentProject: (state, action) => {
      const newId = action.payload;
      state.project_id = newId;
    },
    setcurrentProjectName: (state, action) => {
      const name = action.payload;
      state.current_project_name = name;
    },
    setprojects: (state, action) => {
      state.projects = action.payload;
      state.originalProjects = action.payload;
    },
    setShowEyeButton: (state, action) => {
      const { id, value } = action.payload;
      const project = state.projects.find((project) => project.id === id);
      project.show_eye_button = value;
      const originalProject = state.originalProjects.find(
        (project) => project.id === id
      );
      originalProject.show_eye_button = value;
    },
    setProjectChecked: (state, action) => {
      const { id, value } = action.payload;
      state.projects.map((project) => {
        if (project.id === id) {
          project.checked = value;
          project.openProperties = value;
        } else {
          project.checked = false;
          project.openProperties = false;
        }
      });

      state.originalProjects.map((project) => {
        if (project.id === id) {
          project.checked = value;
          project.openProperties = value;
        } else {
          project.checked = false;
          project.openProperties = false;
        }
      });
    },
    setProjectOpenProperties: (state, action) => {
      const { id, value } = action.payload;
      state.projects.map((project) => {
        if (project.id === id) {
          project.openProperties = value;
        } else {
          project.openProperties = false;
        }
      });

      state.originalProjects.map((project) => {
        if (project.id === id) {
          project.openProperties = value;
        } else {
          project.openProperties = false;
        }
      });
    },
    filterProjects: (state, action) => {
      const text = action.payload.toLowerCase();
      state.projects = state.originalProjects.filter((project) => {
        return (
          project.name.toLowerCase().includes(text) ||
          project.description.toLowerCase().includes(text)
        );
      });
    },
    setOpenEditProjectForm(state, action) {
      state.openEditProjectForm = action.payload;
    },
    setEditProjectId: (state, action) => {
      state.editProjectId = action.payload;
    },

    setOpenIndoorForm(state, action) {
      state.openIndoorForm = action.payload;
    },
    setEditIndoorProjectId: (state, action) => {
      state.editIndoorProjectId = action.payload;
    },
    setIndoors: (state, action) => {
      state.indoors = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setcurrentProject,
  setcurrentProjectName,
  setprojects,
  setShowEyeButton,
  setProjectChecked,
  setProjectOpenProperties,
  filterProjects,
  setOpenEditProjectForm,
  setEditProjectId,
  setOpenIndoorForm,
  setEditIndoorProjectId,
  setIndoors,
} = Project.actions;

export default Project.reducer;
