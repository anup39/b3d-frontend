import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  user_id: localStorage.getItem("user_id"),
  username: localStorage.getItem("username"),
  role_name: localStorage.getItem("role_name"),
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
      state.username = action.payload;
    },
    setRole: (state, action) => {
      state.role_name = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setToken, setUserId, setUserName, setRole } = Auth.actions;

export default Auth.reducer;
