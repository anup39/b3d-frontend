import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [],
};

export const UploadMeasuring = createSlice({
  name: "UploadMeasuring",
  initialState,
  reducers: {
    setLayers: (state, action) => {
      state.layers = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setLayers } = UploadMeasuring.actions;

export default UploadMeasuring.reducer;
