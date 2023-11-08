import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard/UserCard";
import { useEffect } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = [];
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_DASHBOARD_URL}/users`).then((res) => {
      setUsers(res.data);
    });
  }, [setUsers]);

  return (
    <>
      <AppBar></AppBar>
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
                key={user.id}
                id={user.id}
                username={user.username}
                email={user.email}
              />
            ))
          : null}
      </div>
    </>
  );
}
