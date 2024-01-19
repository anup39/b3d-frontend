import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inspectionData: [],
};
export const Inspection = createSlice({
  name: "Inspection",
  initialState,
  reducers: {
    setInspectionData: (state, action) => {
      state.inspectionData = action.payload;
    },
  },
});
// eslint-disable-next-line react-refresh/only-export-components
export const { setInspectionData } = Inspection.actions;
export default Inspection.reducer;
