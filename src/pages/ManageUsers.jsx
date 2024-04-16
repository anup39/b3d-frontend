import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../reducers/Users";
import AppBar from "../components/Common/AppBar";
import UserCard from "../components/ManageUser/UserCard";
import UserForm from "../components/ManageUser/UserForm";
import AsignRoleForm from "../components/ManageUser/AsignRoleForm";

export default function ManageUsers() {
  const dispatch = useDispatch();
  const { client_id } = useParams();
  const user_id = useSelector((state) => state.auth.user_id);
  const [openForm, setOpenFrom] = useState(false);

  const users = useSelector((state) => state.users.users);

  // const onUserId = (value) => {
  //   setUserId(value);
  // };

  const onOpenForm = (value) => {
    setOpenFrom(value);
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/roles/?client=${client_id}`
      )
      .then((res) => {
        dispatch(setUsers(res.data));
        console.log(res.data);
      });
  }, [client_id, dispatch]);

  return (
    <>
      <AppBar></AppBar>
      <AsignRoleForm
        user_id={user_id}
        openForm={openForm}
        onOpenForm={onOpenForm}
      />

      <UserForm client_id={client_id} />
      <div>
        {users
          ? users.map((user) => (
              <UserCard
                // onUserId={onUserId}
                onOpenForm={onOpenForm}
                key={user.id}
                id={user.id}
                username={user.username}
                email={user.email}
                role={user.role}
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
