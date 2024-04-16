import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteUserRoleId: null,
  users: [],
};

export const Users = createSlice({
  name: "Users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setDeleteUserRoleId: (state, action) => {
      state.deleteUserRoleId = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setUsers, setDeleteUserRoleId } = Users.actions;

export default Users.reducer;
