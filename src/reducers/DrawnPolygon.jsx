import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wkt_geometry: null,
};

export const DrawnPolygon = createSlice({
  name: "DrawnPolygon",
  initialState,
  reducers: {
    setWKTGeometry: (state, action) => {
      state.wkt_geometry = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setWKTGeometry } = DrawnPolygon.actions;

export default DrawnPolygon.reducer;
