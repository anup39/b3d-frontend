import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function UserCard({
  id,
  username,
  email,
  role,
  last_login,
  date_joined,
  onUserId,
  onOpenForm,
}) {
  const navigate = useNavigate();
  const username_current = useSelector((state) => state.auth.username);

  const handleAssignRole = () => {
    onUserId(id);
    onOpenForm(true);
  };

  const handleDeleteUser = () => {
    // navigate(`/map/${id}`);
    console.log("Delete User");
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
                        <button className="btn-main" onClick={handleDeleteUser}>
                          Delete
                        </button>
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
};
