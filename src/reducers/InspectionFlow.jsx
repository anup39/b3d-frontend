import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  client_id: null,
  images: [],
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
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setClientID,
  //  setShowInspectionTypeFormOpen
  setImages,
  setSelected,
} = InspectionFlow.actions;

export default InspectionFlow.reducer;
