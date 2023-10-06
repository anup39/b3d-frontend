import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user_id: "",
  user_name: "",
};

export const Auth = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setUserName: (state, action) => {
      state.user_name = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line react-refresh/only-export-components
export const { setToken, setUserId, setUserName } = Auth.actions;

export default Auth.reducer;
