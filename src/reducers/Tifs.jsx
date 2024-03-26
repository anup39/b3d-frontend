import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tifs: [],
};

export const Tifs = createSlice({
  name: "Tifs",
  initialState,
  reducers: {
    settifs: (state, action) => {
      state.tifs = action.payload;
    },
    setTifChecked: (state, action) => {
      const { id, value } = action.payload;
      state.tifs.map((tif) => {
        if (tif.id === id) {
          tif.checked = value;
        } else {
          tif.checked = false;
        }
      });
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { settifs, setTifChecked } = Tifs.actions;

export default Tifs.reducer;
