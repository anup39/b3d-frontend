import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  client_id: null,
};

export const InspectionFlow = createSlice({
  name: "InspectionFlow",
  initialState,
  reducers: {
    setClientID: (state, action) => {
      state.client_id = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setClientID } = InspectionFlow.actions;

export default InspectionFlow.reducer;
