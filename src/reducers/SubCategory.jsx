import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subCategorys: [],
};

export const SubCategory = createSlice({
  name: "SubCategory",
  initialState,
  reducers: {
    setSubCategorys: (state, action) => {
      state.subCategorys = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setSubCategorys } = SubCategory.actions;

export default SubCategory.reducer;
