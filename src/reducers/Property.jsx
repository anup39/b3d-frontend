import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showProgressFormOpen: false,
  progress: 0,
  properties: [],
};

export const Property = createSlice({
  name: "Property",
  initialState,
  reducers: {
    setproperties: (state, action) => {
      state.properties = action.payload;
    },
    setshowProgressFormOpen: (state, action) => {
      state.showProgressFormOpen = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setproperties, setshowProgressFormOpen, setProgress } =
  Property.actions;

export default Property.reducer;
