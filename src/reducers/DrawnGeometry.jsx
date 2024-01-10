import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wkt_geometry: null,
  type_of_geometry: null,
  category_id: null,
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
    setCategoryId: (state, action) => {
      state.category_id = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setWKTGeometry, setTypeOfGeometry, setCategoryId } =
  DrawnGeometry.actions;

export default DrawnGeometry.reducer;
