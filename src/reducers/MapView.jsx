import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientId: null,
  showShapefileUpload: false,
  showUploadingCategories: false,
  showReport: false,
  showMap: true,
  showTableMeasurings: false,
  showPiechart: false,
};

export const MapView = createSlice({
  name: "MapView",
  initialState,
  reducers: {
    setClientId: (state, action) => {
      state.clientId = action.payload;
    },
    setshowShapefileUpload: (state, action) => {
      state.showShapefileUpload = action.payload;
    },
    setshowUploadingCategories: (state, action) => {
      state.showUploadingCategories = action.payload;
    },
    setshowReport: (state, action) => {
      state.showReport = action.payload;
    },
    setshowMap: (state, action) => {
      state.showMap = action.payload;
    },
    setshowTableMeasurings: (state, action) => {
      state.showTableMeasurings = action.payload;
    },
    setshowPiechart: (state, action) => {
      state.showPiechart = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setClientId,
  setshowShapefileUpload,
  setshowUploadingCategories,
  setshowReport,
  setshowMap,
  setshowTableMeasurings,
  setshowPiechart,
} = MapView.actions;

export default MapView.reducer;
