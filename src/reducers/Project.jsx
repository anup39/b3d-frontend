import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
};

export const Project = createSlice({
  name: "Project",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setProjects } = Project.actions;

export default Project.reducer;
