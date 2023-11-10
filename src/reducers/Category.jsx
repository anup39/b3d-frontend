import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categorys: [],
};

export const Category = createSlice({
  name: "Category",
  initialState,
  reducers: {
    setCategorys: (state, action) => {
      state.categorys = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setCategorys } = Category.actions;

export default Category.reducer;
