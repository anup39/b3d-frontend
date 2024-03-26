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
      console.log(action.payload, "action.payload");
      const { tif_id, checked } = action.payload;
      state.tifs.map((tif) => {
        if (tif.id === tif_id) {
          console.log("HERE ");
          tif.checked = checked;
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
