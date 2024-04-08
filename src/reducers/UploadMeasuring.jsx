import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [],
  currentfile: null,
  distinct: [],
};

export const UploadMeasuring = createSlice({
  name: "UploadMeasuring",
  initialState,
  reducers: {
    setLayers: (state, action) => {
      state.layers = action.payload;
    },
    setCurrentFile: (state, action) => {
      state.currentfile = action.payload;
    },
    setdistinct: (state, action) => {
      state.distinct = action.payload;
    },
    changeDistinctChecked: (state, action) => {
      const { id, checked } = action.payload;
      const distinctItem = state.distinct.find((item) => item.id === id);
      if (distinctItem) {
        distinctItem.checked = checked;
      }
    },
    changeDistinctMatchedCategory: (state, action) => {
      const { id, selected_category } = action.payload;
      const distinctItem = state.distinct.find((item) => item.id === id);
      if (distinctItem) {
        distinctItem.category_id = selected_category;
      }
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setLayers,
  setCurrentFile,
  setdistinct,
  changeDistinctChecked,
  changeDistinctMatchedCategory,
} = UploadMeasuring.actions;

export default UploadMeasuring.reducer;
