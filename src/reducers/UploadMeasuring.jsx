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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setLayers, setCurrentFile, setdistinct } =
  UploadMeasuring.actions;

export default UploadMeasuring.reducer;
