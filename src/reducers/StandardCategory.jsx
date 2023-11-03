import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  standardCategorys: [],
};

export const StandardCategory = createSlice({
  name: "StandardCategory",
  initialState,
  reducers: {
    setStandardCategorys: (state, action) => {
      state.standardCategorys = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setStandardCategorys } = StandardCategory.actions;

export default StandardCategory.reducer;
