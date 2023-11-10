import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryStyles: [],
};

export const CategoryStyle = createSlice({
  name: "CategoryStyle",
  initialState,
  reducers: {
    setCategoryStyles: (state, action) => {
      state.categoryStyles = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setCategoryStyles } = CategoryStyle.actions;

export default CategoryStyle.reducer;
