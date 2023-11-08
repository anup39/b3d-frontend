import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSucessToast: false,
  showErrorToast: false,
  sucessToastMessage: "Sucessful",
  errorToastMessage: "Error",
  showGeomFormPopup: "none",
};

export const DisplaySettings = createSlice({
  name: "DisplaySettings",
  initialState,
  reducers: {
    setshowSucessToast: (state, action) => {
      state.showSucessToast = action.payload;
    },
    setshowErrorToast: (state, action) => {
      state.showErrorToast = action.payload;
    },
    setsucessToastMessage: (state, action) => {
      state.sucessToastMessage = action.payload;
    },
    seterrorToastMessage: (state, action) => {
      state.errorToastMessage = action.payload;
    },
    setshowGeomFormPopup: (state, action) => {
      state.showGeomFormPopup = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setshowSucessToast,
  setshowErrorToast,
  setsucessToastMessage,
  seterrorToastMessage,
  setshowGeomFormPopup,
} = DisplaySettings.actions;

export default DisplaySettings.reducer;
