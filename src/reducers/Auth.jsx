import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "anup",
};

export const Auth = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    toggleUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const { toggleUsername } = Auth.actions;

export default Auth.reducer;
