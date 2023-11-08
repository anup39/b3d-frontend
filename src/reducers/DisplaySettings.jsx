import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showToast: false,
  toastMessage: "Error creating user",
  toastType: "error",
  showGeomFormPopup: "none",
};

export const DisplaySettings = createSlice({
  name: "DisplaySettings",
  initialState,
  reducers: {
    setshowToast: (state, action) => {
      state.showToast = action.payload;
    },
    settoastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    settoastType: (state, action) => {
      state.toastType = action.payload;
    },
    setshowGeomFormPopup: (state, action) => {
      state.showGeomFormPopup = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setshowToast,
  settoastMessage,
  settoastType,
  setshowGeomFormPopup,
} = DisplaySettings.actions;

export default DisplaySettings.reducer;
