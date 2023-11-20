import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { setUsers } from "../../reducers/Users";

export default function UserCard({
  id,
  username,
  email,
  role,
  last_login,
  date_joined,
  // onUserId,
  // onOpenForm,
  client_id,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username_current = useSelector((state) => state.auth.username);
  const [loading, setLoading] = useState(false);

  const handleAssignRole = () => {
    onUserId(id);
    onOpenForm(true);
  };

  const handleDeleteUser = () => {
    setLoading(true);
    // navigate(`/map/${id}`);
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/${id}/`)
      .then((res) => {
        const user_role_data = res.data;
        const data = {
          is_deleted: true,
        };
        axios
          .patch(
            `${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/${id}/`,
            data
          )
          .then(() => {
            const user_data = {
              is_active: false,
            };
            axios
              .patch(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/users/${
                  user_role_data.user
                }/`,
                user_data
              )
              .then(() => {
                setLoading(false);
                dispatch(setshowToast(true));
                dispatch(settoastMessage("Sucessfully deleted the User"));
                dispatch(settoastType("success"));
                axios
                  .get(
                    `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/user-role/?client=${client_id}`
                  )
                  .then((res) => {
                    dispatch(setUsers(res.data));
                  });
              });
          });
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to Create User"));
        dispatch(settoastType("error"));
      });
  };

  return (
    <>
      {username_current !== username ? (
        <Paper
          sx={{
            p: 1,
            margin: 1,
            // maxWidth: 500,
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    <b>User Name </b>: {username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Email</b> : {email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Role</b> : {role}
                  </Typography>
                  {/* <Typography gutterBottom variant="subtitle1" component="div">
                    <b>Last Login</b> :{" "}
                    {last_login ? last_login : "Not logged in Yet"}
                  </Typography> */}
                  <Typography variant="body2" color="text.secondary">
                    <b>Date Joined</b> : {date_joined}
                  </Typography>
                </Grid>
                <Grid item xs container direction="row" spacing={2}>
                  {role !== "admin" ? (
                    <>
                      <Grid item>
                        <button className="btn-main" onClick={handleAssignRole}>
                          Assign Roles
                        </button>
                      </Grid>
                      <Grid item>
                        {loading ? (
                          <CircularProgress />
                        ) : (
                          <button
                            className="btn-main"
                            onClick={handleDeleteUser}
                          >
                            Delete
                          </button>
                        )}
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs>
                      <Typography variant="body2" color="text.secondary">
                        <b>
                          Full Access due to Role Admin. No need to assign role
                          and project
                        </b>
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </>
  );
}

UserCard.propTypes = {
  id: PropTypes.number,
  username: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  last_login: PropTypes.string,
  date_joined: PropTypes.string,
  onUserId: PropTypes.func,
  onOpenForm: PropTypes.func,
  client_id: PropTypes.string,
};
