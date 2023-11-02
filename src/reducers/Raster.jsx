import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rasters: [],
};

export const Raster = createSlice({
  name: "Raster",
  initialState,
  reducers: {
    setrasters: (state, action) => {
      state.rasters = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const { setRasters } = Raster.actions;

export default Raster.reducer;
