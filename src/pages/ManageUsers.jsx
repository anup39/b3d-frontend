import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import UserTransferList from "../components/UserTransferList/UserTransferList";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard/UserCard";

export default function ManageUsers() {
  const navigate = useNavigate();
  const { client_id } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/user-role/?client=${client_id}`
      )
      .then((res) => {
        // dispatch(setUsers(res.data));
        setUsers(res.data);
      });
  }, [client_id]);

  return (
    <>
      <AppBar></AppBar>

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

      <div>
        {users
          ? users.map((user) => (
              <UserCard
                // onUserId={onUserId}
                // onOpenForm={onOpenForm}
                key={user.id}
                id={user.id}
                username={user.username}
                email={user.email}
                role={user.role_name}
                last_login={user.last_login}
                date_joined={user.date_joined}
              />
            ))
          : null}
      </div>

      {/* <Box
        sx={{
          bgcolor: "background.paper",
          display: "block",
          height: 224,
          margin: 10,
        }}
      >
        <Tooltip>
          <Button
            sx={{ marginBottom: "25px" }}
            variant="outlined"
            color="error"
          >
            {clientName}
          </Button>
        </Tooltip> */}
      {/* <UserTransferList id={parseInt(id)} component={"users"} /> */}
      {/* </Box> */}
    </>
  );
}
