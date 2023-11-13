import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
};

export const Client = createSlice({
  name: "Client",
  initialState,
  reducers: {
    setclients: (state, action) => {
      state.clients = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setclients } = Client.actions;

export default Client.reducer;
