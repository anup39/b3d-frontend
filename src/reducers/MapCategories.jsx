import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  client_id: null,
  project_name: "",
  standard_categories: [],
  sub_categories: [],
  categories: [],
};

export const MapCategories = createSlice({
  name: "MapCategories",
  initialState,
  reducers: {
    setClient: (state, action) => {
      state.client_id = action.payload;
    },
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
    updateCheckedById: (state, action) => {
      const { id, checked } = action.payload;
      const categoryToUpdate = state.categories.find(
        (category) => category.id === id
      );
      if (categoryToUpdate) {
        categoryToUpdate.checked = checked;
      }
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setClient,
  setStandardCategories,
  setSubCategories,
  setCategories,
  setProjectName,
  updateCheckedById,
} = MapCategories.actions;

export default MapCategories.reducer;
