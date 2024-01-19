import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showToast: false,
  toastMessage: "Error creating user",
  toastType: "error",
  showDeletePopup: false,
  deletePopupMessage: "Are you sure you want to delete?",
  deleteId: null,
  deleteTarget: "",
  showGeomFormPopup: "none",
  showErrorPopup: false,
  errorMessage: "There is an error",
  showDeleteUserPopup: false,
  deleteUserPopupMessage: "Are you sure you want to delete this user?",
  deleteUserRoleId: null,
  showTifUpload: false,
  showUploadInspection: false,
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
    setshowDeletePopup: (state, action) => {
      state.showDeletePopup = action.payload;
    },
    setdeletePopupMessage: (state, action) => {
      state.deletePopupMessage = action.payload;
    },
    setdeleteId: (state, action) => {
      state.deleteId = action.payload;
    },
    setdeleteTarget: (state, action) => {
      state.deleteTarget = action.payload;
    },
    setshowErrorPopup: (state, action) => {
      state.showErrorPopup = action.payload;
    },
    seterrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setshowDeleteUserPopup: (state, action) => {
      state.showDeleteUserPopup = action.payload;
    },
    setdeleteUserPopupMessage: (state, action) => {
      state.deleteUserPopupMessage = action.payload;
    },
    setdeleteUserRoleId: (state, action) => {
      state.deleteUserRoleId = action.payload;
    },
    setshowTifUpload: (state, action) => {
      state.showTifUpload = action.payload;
    },
    setshowUploadInspection: (state, action) => {
      state.showUploadInspection = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setshowToast,
  settoastMessage,
  settoastType,
  setshowDeletePopup,
  setdeletePopupMessage,
  setdeleteId,
  setdeleteTarget,
  setshowGeomFormPopup,
  setshowErrorPopup,
  seterrorMessage,
  setshowDeleteUserPopup,
  setdeleteUserPopupMessage,
  setdeleteUserRoleId,
  setshowTifUpload,
  setshowUploadInspection,
} = DisplaySettings.actions;

export default DisplaySettings.reducer;
