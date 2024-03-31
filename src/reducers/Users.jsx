import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

export const Users = createSlice({
  name: "Users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setUsers } = Users.actions;

export default Users.reducer;
