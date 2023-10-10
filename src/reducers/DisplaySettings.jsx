import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showButton: false,
  showGeomFormPopup: "none",
};

export const DisplaySettings = createSlice({
  name: "DisplaySettings",
  initialState,
  reducers: {
    toggleShowButton: (state, action) => {
      state.showButton = action.payload;
    },
    toggleShowGeomFormPopup: (state, action) => {
      state.showGeomFormPopup = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const { toggleShowButton, toggleShowGeomFormPopup } =
  DisplaySettings.actions;

export default DisplaySettings.reducer;
