import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientDetail: { client_id: null, client_name: null, client_image: null },
  showShapefileUpload: false,
  showUploadingCategories: false,
  showReport: false,
  showMap: true,
  showMeasuringsPanel: false,
  showTableMeasurings: false,
  showPiechart: false,
  showTifPanel: false,
  currentMapDetail: {
    selected_projects_ids: [],
    current_project_measuring_table: null,
    current_project_name: null,
    current_tif: null,
  },
};

export const MapView = createSlice({
  name: "MapView",
  initialState,
  reducers: {
    setClientDetail: (state, action) => {
      state.clientDetail = action.payload;
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
    setshowMeasuringsPanel: (state, action) => {
      state.showMeasuringsPanel = action.payload;
    },
    setshowTableMeasurings: (state, action) => {
      state.showTableMeasurings = action.payload;
    },
    setshowPiechart: (state, action) => {
      state.showPiechart = action.payload;
    },
    setshowTifPanel: (state, action) => {
      state.showTifPanel = action.payload;
    },
    addSelectedProjectId: (state, action) => {
      const newId = action.payload;
      state.currentMapDetail.selected_projects_ids.push(newId);
    },
    removeSelectedProjectId: (state, action) => {
      const idToRemove = action.payload;
      state.currentMapDetail.selected_projects_ids =
        state.currentMapDetail.selected_projects_ids.filter(
          (id) => id !== idToRemove
        );
    },
    addcurrentProjectMeasuringTable: (state, action) => {
      const newId = action.payload;
      state.currentMapDetail.current_project_measuring_table = newId;
    },
    setcurrentProjectName: (state, action) => {
      const name = action.payload;
      state.currentMapDetail.current_project_name = name;
    },
    setcurrentTif: (state, action) => {
      const tif_data = action.payload;
      state.currentMapDetail.current_tif = tif_data;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setClientDetail,
  setshowShapefileUpload,
  setshowUploadingCategories,
  setshowReport,
  setshowMap,
  setshowMeasuringsPanel,
  setshowTableMeasurings,
  setshowPiechart,
  setshowTifPanel,
  addSelectedProjectId,
  removeSelectedProjectId,
  addcurrentProjectMeasuringTable,
  setcurrentProjectName,
  setcurrentTif,
} = MapView.actions;

export default MapView.reducer;
