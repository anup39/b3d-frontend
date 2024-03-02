import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  standardInspections: [],
};

export const StandardInspection = createSlice({
  name: "StandardInspection",
  initialState,
  reducers: {
    setStandardInspections: (state, action) => {
      state.standardInspections = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setStandardInspections } = StandardInspection.actions;

export default StandardInspection.reducer;
