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

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const { setCategorys } = Category.actions;

export default Category.reducer;
