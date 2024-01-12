import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [],
  currentfile: null,
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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setLayers, setCurrentFile } = UploadMeasuring.actions;

export default UploadMeasuring.reducer;
