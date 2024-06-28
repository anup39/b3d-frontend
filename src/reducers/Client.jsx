import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientDetail: { client_id: null, client_name: null, client_image: null },
  current_measuring_categories: null,
  clients: [],
  isClientUpdated: false, //flag to check client edit/delete form action
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
    setCurrentMeasuringCategories: (state, action) => {
      const current_measuring_categories = action.payload;
      state.current_measuring_categories = current_measuring_categories;
    },
    setIsClientUpdated: (state, action) => {
      state.isClientUpdated = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setclients,
  setClientDetail,
  setCurrentMeasuringCategories,
  setIsClientUpdated,
} = Client.actions;

export default Client.reducer;
