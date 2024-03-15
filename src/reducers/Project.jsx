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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setprojects, setShowArea } = Project.actions;

export default Project.reducer;
