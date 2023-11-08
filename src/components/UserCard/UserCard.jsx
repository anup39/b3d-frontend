import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function UserCard({
  id,
  username,
  email,
  last_login,
  date_joined,
}) {
  const [role, setRole] = useState("");
  const username_current = useSelector((state) => state.auth.username);
  const handleAssignRole = () => {
    // navigate(`/map/${id}`);
    console.log("Assing Role");
  };

  const handleDeleteUser = () => {
    // navigate(`/map/${id}`);
    console.log("Delete User");
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
                  <Typography gutterBottom variant="subtitle1" component="div">
                    <b>Email</b> : {email}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    <b>Role</b> : {role}
                  </Typography>
                  {/* <Typography gutterBottom variant="subtitle1" component="div">
                    <b>Last Login</b> :{" "}
                    {last_login ? last_login : "Not logged in Yet"}
                  </Typography> */}
                  <Typography gutterBottom variant="subtitle1" component="div">
                    <b>Date Joined</b> : {date_joined}
                  </Typography>
                </Grid>
                <Grid item xs container direction="row" spacing={2}>
                  <Grid item>
                    <Button
                      onClick={handleAssignRole}
                      variant="contained"
                      color="error"
                    >
                      Assign Roles
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={handleDeleteUser}
                      variant="contained"
                      color="success"
                    >
                      Delete
                    </Button>
                  </Grid>
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
  last_login: PropTypes.string,
  date_joined: PropTypes.string,
};
