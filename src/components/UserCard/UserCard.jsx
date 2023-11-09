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
  last_login,
  date_joined,
  onUserId,
  onOpenForm,
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const username_current = useSelector((state) => state.auth.username);

  const handleAssignRole = () => {
    onUserId(id);
    onOpenForm(true);
  };

  const handleDeleteUser = () => {
    // navigate(`/map/${id}`);
    console.log("Delete User");
  };

  const handleManageProjects = () => {
    navigate(`/manage-projects/${id}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/?user=${id}`)
      .then((res) => {
        setRole(res?.data[0]?.role_name);
      });
  }, [id]);

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
                  {/* <Typography gutterBottom variant="subtitle1" component="div">
                <b>ID </b>: {id}
              </Typography> */}
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
                        <Button
                          onClick={handleAssignRole}
                          variant="contained"
                          color="success"
                        >
                          Assign Roles
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={handleManageProjects}
                          variant="contained"
                          color="success"
                        >
                          Manage Clients
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={handleDeleteUser}
                          variant="contained"
                          color="error"
                        >
                          Delete
                        </Button>
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
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  <b>Total Assigned Projects</b> : {2}
                </Typography>
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
  last_login: PropTypes.string,
  date_joined: PropTypes.string,
  onUserId: PropTypes.func,
  onOpenForm: PropTypes.func,
};
