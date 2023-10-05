import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project_name: "",
  standard_categories: [],
  sub_categories: [],
  categories: [],
};

export const MapCategories = createSlice({
  name: "MapCategories",
  initialState,
  reducers: {
    setStandardCategories: (state, action) => {
      state.standard_categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.sub_categories = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProjectName: (state, action) => {
      state.project_name = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const {
  setStandardCategories,
  setSubCategories,
  setCategories,
  setProjectName,
} = MapCategories.actions;

export default MapCategories.reducer;
