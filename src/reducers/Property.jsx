import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showProgressFormOpen: false,
  client_id_property: null,
  project_id_property: null,
  progress: 0,
  properties: [],
};

export const Property = createSlice({
  name: 'Property',
  initialState,
  reducers: {
    setproperties: (state, action) => {
      state.properties = action.payload;
    },
    setshowProgressFormOpen: (state, action) => {
      state.showProgressFormOpen = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setClientIdProperty: (state, action) => {
      state.client_id_property = action.payload;
    },
    setProjectIdProperty: (state, action) => {
      state.project_id_property = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setproperties,
  setshowProgressFormOpen,
  setProgress,
  setClientIdProperty,
  setProjectIdProperty,
} = Property.actions;

export default Property.reducer;
