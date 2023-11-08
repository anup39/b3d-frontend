import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard/UserCard";
import { useEffect, useState } from "react";
import axios from "axios";
import AsignRoleForm from "../components/AsignRoleForm/AsignRoleForm";
import { setUsers } from "../reducers/Users";
import { useSelector, useDispatch } from "react-redux";

export default function Users() {
  const dispatch = useDispatch();
  const [userid, setUserId] = useState();
  const [openForm, setOpenFrom] = useState(false);

  const users = useSelector((state) => state.users.users);

  const navigate = useNavigate();

  const onUserId = (value) => {
    setUserId(value);
  };

  const onOpenForm = (value) => {
    setOpenFrom(value);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/users/`)
      .then((res) => {
        dispatch(setUsers(res.data));
      });
  }, [dispatch]);

  return (
    <>
      <AppBar></AppBar>
      <AsignRoleForm
        user_id={userid}
        openForm={openForm}
        onOpenForm={onOpenForm}
      />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tooltip>
          <Button
            onClick={() => navigate("/register")}
            sx={{
              //   marginBottom: "15px",
              marginTop: "5px",
              marginLeft: "5px",
              marginRight: "5px",
            }}
            variant="contained"
            color="error"
          >
            Create User
          </Button>
        </Tooltip>
      </Box>

      <div>
        {users
          ? users.map((user) => (
              <UserCard
                onUserId={onUserId}
                onOpenForm={onOpenForm}
                key={user.id}
                id={user.id}
                username={user.username}
                email={user.email}
                last_login={user.last_login}
                date_joined={user.date_joined}
              />
            ))
          : null}
      </div>
    </>
  );
}
