import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../reducers/Users";
import AppBar from "../components/Common/AppBar";
import UserCard from "../components/ManageUser/UserCard";
import UserForm from "../components/ManageUser/UserForm";
import AsignRoleForm from "../components/ManageUser/AsignRoleForm";
import DeleteUserRoleForm from "../components/ManageUser/DeleteUserRoleForm";
import AssignPropertiesToUser from "../components/ManageUser/AssignPropertiesToUser";

export default function ManageUsers() {
  const dispatch = useDispatch();
  const { client_id } = useParams();
  const [user_id, setUserId] = useState(null);
  const [user_name, setUserName] = useState(null);
  const [openForm, setOpenFrom] = useState(false);

  const users = useSelector((state) => state.users.users);
  const showAssignPropertiesPopup = useSelector(
    (state) => state.displaySettings.showAssignPropertiesPopup
  );

  const onUserId = (value) => {
    setUserId(value);
  };

  const onUserName = (value) => {
    setUserName(value);
  };

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
        // console.log(res.data);
      });
  }, [client_id, dispatch]);

  return (
    <>
      <AppBar></AppBar>
      <AsignRoleForm
        client_id={client_id}
        user_id={user_id}
        user_name={user_name}
        openForm={openForm}
        onOpenForm={onOpenForm}
      />
      <DeleteUserRoleForm client_id={client_id} />

      {showAssignPropertiesPopup ? (
        <AssignPropertiesToUser client_id={client_id} />
      ) : null}

      <UserForm client_id={client_id} />
      <div>
        {users
          ? users.map((user) => (
              <UserCard
                onUserId={onUserId}
                onUserName={onUserName}
                onOpenForm={onOpenForm}
                key={user.id}
                id={user.id}
                username={user.user_name}
                email={user.email}
                role={user.group_name}
                last_login={user.created_at}
                date_joined={user.created_at}
                client_id={client_id}
                user={user.user}
              />
            ))
          : null}
      </div>
    </>
  );
}
