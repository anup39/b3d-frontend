import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientDetail: { client_id: null, client_name: null, client_image: null },
  clients: [],
};

export const Client = createSlice({
  name: "Client",
  initialState,
  reducers: {
    setclients: (state, action) => {
      state.clients = action.payload;
    },
    setClientDetail: (state, action) => {
      state.clientDetail = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setclients, setClientDetail } = Client.actions;

export default Client.reducer;
