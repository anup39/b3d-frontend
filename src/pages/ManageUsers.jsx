import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import UserCard from "../components/UserCard/UserCard";
import UserForm from "../components/UserForm/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../reducers/Users";
import AsignRoleForm from "../components/AsignRoleForm/AsignRoleForm";

export default function ManageUsers() {
  const dispatch = useDispatch();
  const { client_id } = useParams();
  const [userid, setUserId] = useState();
  const [openForm, setOpenFrom] = useState(false);

  const users = useSelector((state) => state.users.users);

  const onUserId = (value) => {
    setUserId(value);
  };

  const onOpenForm = (value) => {
    setOpenFrom(value);
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/user-role/?client=${client_id}`
      )
      .then((res) => {
        dispatch(setUsers(res.data));
        // setUsers(res.data);
      });
  }, [client_id, dispatch]);

  return (
    <>
      <AppBar></AppBar>
      <AsignRoleForm
        user_id={userid}
        openForm={openForm}
        onOpenForm={onOpenForm}
      />

      <UserForm client_id={client_id} />
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
                role={user.role_name}
                last_login={user.last_login}
                date_joined={user.date_joined}
                client_id={client_id}
              />
            ))
          : null}
      </div>
    </>
  );
}
