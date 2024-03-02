import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inspections: [],
};

export const Inspection = createSlice({
  name: "Inspection",
  initialState,
  reducers: {
    setInspections: (state, action) => {
      state.inspections = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setInspections } = Inspection.actions;

export default Inspection.reducer;
