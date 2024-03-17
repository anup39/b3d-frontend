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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setprojects, setShowArea, setShowAreaDisabled } =
  Project.actions;

export default Project.reducer;
