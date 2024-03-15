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
      console.log(id, value, "id, value");
      const project = state.projects.find((project) => project.id === id);
      console.log(project, value, "project");
      project.show_area = value;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setprojects, setShowArea } = Project.actions;

export default Project.reducer;
