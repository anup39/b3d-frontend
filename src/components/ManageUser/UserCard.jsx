import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  setshowDeleteUserRolePopup,
  setshowAssignPropertiesPopup,
} from "../../reducers/DisplaySettings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import {
  setDeleteUserRoleId,
  setAssignProperitesUser,
} from "../../reducers/Users";
import ApartmentIcon from "@mui/icons-material/Apartment";

export default function UserCard({
  id,
  username,
  email,
  role,
  date_joined,
  onUserId,
  onOpenForm,
  onUserName,
  user,
}) {
  console.log("user card");
  const dispatch = useDispatch();
  const username_current = useSelector((state) => state.auth.username);

  const handleAssignRole = () => {
    onUserId(user);
    onUserName(username);
    onOpenForm(true);
  };

  const handleDeleteUserRole = () => {
    dispatch(setshowDeleteUserRolePopup(true));
    dispatch(setDeleteUserRoleId(id));
  };

  const handleAssignProperties = () => {
    dispatch(setshowAssignPropertiesPopup(true));
    dispatch(
      setAssignProperitesUser({ user: user, username: username, role_id: id })
    );
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
                  <Typography variant="body2" color="text.secondary">
                    <b>Date Joined</b> :{" "}
                    {new Date(date_joined).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs container direction="row" spacing={2}>
                  {role !== "admin" ? (
                    <>
                      <Grid item>
                        <Tooltip title="Edit Roles">
                          <EditIcon
                            onClick={handleAssignRole}
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          />
                        </Tooltip>
                      </Grid>

                      <Grid item>
                        <Tooltip title="Delete Role">
                          <DeleteIcon
                            onClick={handleDeleteUserRole}
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Assign Properties to user">
                          <ApartmentIcon
                            onClick={handleAssignProperties}
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          />
                        </Tooltip>
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
  date_joined: PropTypes.string,
  onUserId: PropTypes.func,
  onOpenForm: PropTypes.func,
  onUserName: PropTypes.func,
  user: PropTypes.number,
};
