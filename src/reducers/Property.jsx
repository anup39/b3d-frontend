import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
};

export const Property = createSlice({
  name: "Property",
  initialState,
  reducers: {
    setproperties: (state, action) => {
      state.properties = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setproperties } = Property.actions;

export default Property.reducer;
