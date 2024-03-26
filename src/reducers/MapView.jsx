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
  showMapLoader: false,
  currentMapDetail: {
    // selected_projects_ids: [],
    display_type: "2D",
    current_project_measuring_table: null,
    current_project_name: null,
    current_property_polygon_geojson: null,
    current_tif: null,
    current_measuring_categories: null,
    selected_tif: null,
    current_band_infomation: {
      band_red: {
        checked: false,
        color: "red",
      },
      band_green: {
        checked: false,
        color: "green",
      },
      band_blue: {
        checked: false,
        color: "blue",
      },
    },
  },
  tableSummationData: [],
  tableSummationDataColumns: [],
  printDetails: {
    currentMapExtent: null,
  },
  tifs: [],
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
    // addSelectedProjectId: (state, action) => {
    //   const newId = action.payload;
    //   state.currentMapDetail.selected_projects_ids.push(newId);
    // },
    // removeSelectedProjectId: (state, action) => {
    //   const idToRemove = action.payload;
    //   state.currentMapDetail.selected_projects_ids =
    //     state.currentMapDetail.selected_projects_ids.filter(
    //       (id) => id !== idToRemove
    //     );
    // },
    setshowMapLoader: (state, action) => {
      state.showMapLoader = action.payload;
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
    setSelectedTif: (state, action) => {
      const tif_data = action.payload;
      state.currentMapDetail.selected_tif = tif_data;
    },
    setCategoriesState: (state, action) => {
      const current_measuring_categories = action.payload;
      state.currentMapDetail.current_measuring_categories =
        current_measuring_categories;
    },
    setCurrentBandCheckedInfomation: (state, action) => {
      const { checked, band } = action.payload;
      if (band === "red") {
        state.currentMapDetail.current_band_infomation.band_red.checked =
          checked;
      }
      if (band === "green") {
        state.currentMapDetail.current_band_infomation.band_green.checked =
          checked;
      }
      if (band === "blue") {
        state.currentMapDetail.current_band_infomation.band_blue.checked =
          checked;
      }
    },
    setCurrentBandColorInfomation: (state, action) => {
      const { color, band } = action.payload;
      if (band === "red") {
        state.currentMapDetail.current_band_infomation.band_red.color = color;
      }
      if (band === "green") {
        state.currentMapDetail.current_band_infomation.band_green.color = color;
      }
      if (band === "blue") {
        state.currentMapDetail.current_band_infomation.band_blue.color = color;
      }
    },
    resetCurrentBandCheckedInfomation: (state) => {
      state.currentMapDetail.current_band_infomation = {
        band_red: {
          checked: false,
          color: "#FF0000",
        },
        band_green: {
          checked: false,
          color: "#00FF00",
        },
        band_blue: {
          checked: false,
          color: "#0000FF",
        },
      };
    },
    setTableSummationData: (state, action) => {
      state.tableSummationData = action.payload;
    },
    setTableSummationDataColumns: (state, action) => {
      state.tableSummationDataColumns = action.payload;
    },
    setCurrentMapExtent: (state, action) => {
      state.printDetails.currentMapExtent = action.payload;
    },
    setDisplayType: (state, action) => {
      state.currentMapDetail.display_type = action.payload;
    },
    setCurrentPropertyPolygonGeojson: (state, action) => {
      state.currentMapDetail.current_property_polygon_geojson = action.payload;
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
  setshowMapLoader,
  addSelectedProjectId,
  removeSelectedProjectId,
  addcurrentProjectMeasuringTable,
  setcurrentProjectName,
  setcurrentTif,
  setSelectedTif,
  setCategoriesState,
  setCurrentBandCheckedInfomation,
  setCurrentBandColorInfomation,
  resetCurrentBandCheckedInfomation,
  setTableSummationData,
  setTableSummationDataColumns,
  setCurrentMapExtent,
  setDisplayType,
  setCurrentPropertyPolygonGeojson,
} = MapView.actions;

export default MapView.reducer;
