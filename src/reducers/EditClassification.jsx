import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openCategoryEditForm: false,
  categoryEditData: null,
  openCustomFieldForm: false,
  typeOfElement: null,
};

export const EditClassification = createSlice({
  name: "EditClassification",
  initialState,
  reducers: {
    setOpenCategoryEditForm: (state, action) => {
      state.openCategoryEditForm = action.payload;
    },
    setCategoryEditData: (state, action) => {
      state.categoryEditData = action.payload;
    },
    setOpenCustomFieldForm: (state, action) => {
      state.openCustomFieldForm = action.payload;
    },
    setTypeOfElement: (state, action) => {
      state.typeOfElement = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setOpenCategoryEditForm,
  setCategoryEditData,
  setOpenCustomFieldForm,
  setTypeOfElement,
} = EditClassification.actions;

export default EditClassification.reducer;
