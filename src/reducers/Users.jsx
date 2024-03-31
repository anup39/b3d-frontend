import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientId: null,
  users: [],
};

export const Users = createSlice({
  name: "Users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setClientId: (state, action) => {
      state.clientId = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setUsers, setClientId } = Users.actions;

export default Users.reducer;
