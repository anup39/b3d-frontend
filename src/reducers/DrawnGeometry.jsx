import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wkt_geometry: null,
  type_of_geometry: null,
  id: null,
  view_name: null,
  mode: null,
  feature_id: null,
};

export const DrawnGeometry = createSlice({
  name: "DrawnPolygon",
  initialState,
  reducers: {
    setWKTGeometry: (state, action) => {
      state.wkt_geometry = action.payload;
    },
    setTypeOfGeometry: (state, action) => {
      state.type_of_geometry = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setViewName: (state, action) => {
      state.view_name = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setFeatureId: (state, action) => {
      state.feature_id = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setWKTGeometry,
  setTypeOfGeometry,
  setId,
  setViewName,
  setMode,
  setFeatureId,
} = DrawnGeometry.actions;

export default DrawnGeometry.reducer;
