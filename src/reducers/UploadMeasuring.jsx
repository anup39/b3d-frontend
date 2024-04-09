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
      const { main_index, index, checked } = action.payload;
      const distinctItem = state.distinct.find((item, i) => {
        if (i === main_index) {
          return item;
        }
      });

      if (distinctItem) {
        distinctItem[index].checked = checked;
      }
    },
    changeDistinctMatchedCategory: (state, action) => {
      const { index, main_index, selected_category } = action.payload;
      const distinctItem = state.distinct.find((item, i) => {
        if (i === main_index) {
          return item;
        }
      });

      if (distinctItem) {
        distinctItem[index].matched_category = selected_category;
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
