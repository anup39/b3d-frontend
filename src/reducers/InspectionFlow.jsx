import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  client_id: null,
  images: [],
  standard_inspection: [],
  sub_inspection: [],
  inspection: [],
};

export const InspectionFlow = createSlice({
  name: "InspectionFlow",
  initialState,
  reducers: {
    // setShowInspectionTypeFormOpen: (state, action) => {
    //   state.showInspectionTypeFormOpen = action.payload;
    // },
    setClientID: (state, action) => {
      state.client_id = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setSelected: (state, action) => {
      state.images = state.images.map((image) => ({
        ...image,
        selected:
          image.id === action.payload.id ? action.payload.selected : false,
      }));
    },
    setStandardInspection: (state, action) => {
      state.standard_inspection = action.payload;
    },
    setSubInspection: (state, action) => {
      state.sub_inspection = action.payload;
    },
    setInspection: (state, action) => {
      state.inspection = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setClientID,
  //  setShowInspectionTypeFormOpen
  setImages,
  setSelected,
  setStandardInspection,
  setSubInspection,
  setInspection,
} = InspectionFlow.actions;

export default InspectionFlow.reducer;
