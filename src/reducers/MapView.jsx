import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientId: null,
};

export const MapView = createSlice({
  name: "MapView",
  initialState,
  reducers: {
    setClientId: (state, action) => {
      state.clientId = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setClientId } = MapView.actions;

export default MapView.reducer;
