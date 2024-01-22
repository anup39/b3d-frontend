import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  inspection_id: null,
  name: "",
  date: "",
  type_of_inspection: [
    {
      id: 1,
      standard_type: "Roof",
      sub_type: "Tile",
      type: "Broken",
      full_type: "Roof | Tile | Broken",
      checked: true,
    },
    {
      id: 2,
      standard_type: "Roof",
      sub_type: "Tile",
      type: "Replace",
      full_type: "Roof | Tile | Replace",
      checked: true,
    },
    {
      id: 3,
      standard_type: "Garden",
      sub_type: "Marble",
      type: "Broken",
      full_type: "Garden | Marble | Broken",
      checked: true,
    },
  ],
  files: [],
};

export const InspectionUpload = createSlice({
  name: "InspectionUpload",
  initialState,
  reducers: {
    setshowUploadImagesFormOpen: (state, action) => {
      state.showUploadImagesFormOpen = action.payload;
    },
    setInspectionID: (state, action) => {
      state.inspection_id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTypeOfInspection: (state, action) => {
      state.type_of_inspection = action.payload;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setTypeofInspectionChecked: (state, action) => {
      const { id, checked } = action.payload;
      state.type_of_inspection = state.type_of_inspection.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            checked: checked,
          };
        }
        return item;
      });
    },
    setFilesChecked: (state, action) => {
      const { id, checked } = action.payload;
      state.files = state.files.map((item, index) => {
        if (index === id) {
          return {
            ...item,
            checked: checked,
          };
        }
        return item;
      });
    },
    setFile: (state, action) => {
      const { id, name, file } = action.payload;
      state.files = [
        ...state.files,
        {
          name: name,
          file: file,
          checked: false,
        },
      ];
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setshowUploadImagesFormOpen,
  setInspectionID,
  setName,
  setDate,
  setTypeOfInspection,
  setFiles,
  setFile,
  setTypeofInspectionChecked,
  setFilesChecked,
} = InspectionUpload.actions;
export default InspectionUpload.reducer;
