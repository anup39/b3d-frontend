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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setprojects } = Project.actions;

export default Project.reducer;
