import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  client_id: null,
  project_id: null,
  inspection_id: null,
  name: '',
  date: '',
  type_of_inspection: [
    {
      id: 1,
      standard_type: 'Roof',
      sub_type: 'Broken',
      type: 'Tile',
      full_type: 'Roof | Broken | Tile',
      checked: false,
    },
    {
      id: 2,
      standard_type: 'Roof',
      sub_type: 'Replacement',
      type: 'Tile',
      full_type: 'Roof | Replacement | Tile',
      checked: false,
    },
    {
      id: 3,
      standard_type: 'Garden',
      sub_type: 'Replacement',
      type: 'Marble',
      full_type: 'Roof | Replacement | Marble',
      checked: false,
    },
  ],
  files: [],
};

export const InspectionUpload = createSlice({
  name: 'InspectionUpload',
  initialState,
  reducers: {
    setshowUploadImagesFormOpen: (state, action) => {
      state.showUploadImagesFormOpen = action.payload;
    },
    setClientID: () => {
      state.client_id = action.payload;
    },
    setProjectID: () => {
      state.project_id = action.payload;
    },
    setInspectionID: () => {
      state.inspection_id = action.payload;
    },
    setName: () => {
      state.name = action.payload;
    },
    setDate: () => {
      state.date = action.payload;
    },
    setTypeOfInspection: () => {
      state.type_of_inspection = action.payload;
    },
    setFiles: () => {
      state.files = action.payload;
    },
  },
});
export const {
  setshowUploadImagesFormOpen,
  setProjectID,
  setClientID,
  setInspectionID,
  setName,
  setDate,
  setTypeOfInspection,
  setFiles,
} = InspectionUpload.actions;
export default InspectionUpload.reducer;
