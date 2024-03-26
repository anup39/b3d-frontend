import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
};

export const Project = createSlice({
  name: "Project",
  initialState,
  reducers: {
    setprojects: (state, action) => {
      state.projects = action.payload;
    },
    setShowArea: (state, action) => {
      const { id, value } = action.payload;
      const project = state.projects.find((project) => project.id === id);
      project.show_area = value;
    },
    setShowAreaDisabled: (state, action) => {
      const { id, value } = action.payload;
      const project = state.projects.find((project) => project.id === id);
      project.show_area_disabled = value;
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
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setprojects,
  setShowArea,
  setShowAreaDisabled,
  setProjectChecked,
} = Project.actions;

export default Project.reducer;
