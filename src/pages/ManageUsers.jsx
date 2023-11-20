import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import UserCard from "../components/UserCard/UserCard";
import UserForm from "../components/UserForm/UserForm";

export default function ManageUsers() {
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

      <UserForm client_id={client_id} />
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
    </>
  );
}
