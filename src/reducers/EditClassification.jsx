import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openCategoryEditForm: false,
  categoryEditData: null,
  openCustomFieldForm: false,
  typeOfElement: null,
  openEditCustomFieldForm: false,
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
    setOpenEditCustomFieldForm: (state, action) => {
      state.openEditCustomFieldForm = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setOpenCategoryEditForm,
  setCategoryEditData,
  setOpenCustomFieldForm,
  setTypeOfElement,
  setOpenEditCustomFieldForm,
} = EditClassification.actions;

export default EditClassification.reducer;
