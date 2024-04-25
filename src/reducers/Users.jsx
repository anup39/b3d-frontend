import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignProperitesUser: null,
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
    setAssignProperitesUser: (state, action) => {
      state.assignProperitesUser = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setUsers, setDeleteUserRoleId, setAssignProperitesUser } =
  Users.actions;

export default Users.reducer;
