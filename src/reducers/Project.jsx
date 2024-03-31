import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project_id: null,
  current_project_name: null,
  projects: [],
  originalProjects: [],
};

export const Project = createSlice({
  name: "Project",
  initialState,
  reducers: {
    setcurrentProjectMeasuring: (state, action) => {
      const newId = action.payload;
      state.currentMapDetail.project_id = newId;
    },
    setcurrentProjectName: (state, action) => {
      const name = action.payload;
      state.currentMapDetail.current_project_name = name;
    },
    setprojects: (state, action) => {
      state.projects = action.payload;
      state.originalProjects = action.payload;
    },
    setShowArea: (state, action) => {
      const { id, value } = action.payload;
      const project = state.projects.find((project) => project.id === id);
      project.show_area = value;
      const originalProject = state.originalProjects.find(
        (project) => project.id === id
      );
      originalProject.show_area = value;
    },
    setShowAreaDisabled: (state, action) => {
      const { id, value } = action.payload;
      const project = state.projects.find((project) => project.id === id);
      project.show_area_disabled = value;
      const originalProject = state.originalProjects.find(
        (project) => project.id === id
      );
      originalProject.show_area_disabled = value;
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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setcurrentProject,
  setcurrentProjectName,
  setprojects,
  setShowArea,
  setShowAreaDisabled,
  setProjectChecked,
  setProjectOpenProperties,
  filterProjects,
} = Project.actions;

export default Project.reducer;
