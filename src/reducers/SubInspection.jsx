import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subInspections: [],
};

export const SubInspection = createSlice({
  name: "SubInspection",
  initialState,
  reducers: {
    setSubInspections: (state, action) => {
      state.subInspections = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setSubInspections } = SubInspection.actions;

export default SubInspection.reducer;
