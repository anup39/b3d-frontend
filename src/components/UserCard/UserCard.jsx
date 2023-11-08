import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";
import { Button } from "@mui/material";

export default function UserCard({ id, username, email }) {
  const handleAssignRole = () => {
    // navigate(`/map/${id}`);
    console.log("Assing Role");
  };

  const handleDeleteUser = () => {
    // navigate(`/map/${id}`);
    console.log("Delete User");
  };

  return (
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
                <b>ID </b>: {id}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>User Name </b>: {username}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>Email</b> : {email}
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
  );
}

UserCard.propTypes = {
  id: PropTypes.number,
  username: PropTypes.string,
  email: PropTypes.string,
};
