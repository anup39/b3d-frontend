import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUsers } from "../../reducers/Users";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

export default function UserForm({ client_id }) {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const user_id = useSelector((state) => state.auth.user_id);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/groups/`)
      .then((res) => {
        const filtered_group = res.data.filter(
          (group) => group.name !== "admin" && group.name !== "super_admin"
        );
        setRoles(filtered_group);
      })
      .then(() => {});
  }, []);

  const handleCreateUser = (event) => {
    // TODO : Here handle the error since username and email  are checked in backend
    event.preventDefault();
    setLoading(true);
    const data_ = new FormData(event.currentTarget);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/users/`, data_)
      .then((res) => {
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/projects/?client=${client_id}`
          )
          .then((res_) => {
            let projects;
            if (res_.data.length > 0) {
              projects = res_.data.map((project) => project.id);
            } else {
              projects = [];
            }
            const user_data = res.data;
            const user_role_data = {
              user: user_data.id,
              group: inputValue.id,
              created_by: user_id,
              is_display: true,
              client: client_id,
              project: projects,
            };
            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/roles/`,
                user_role_data
              )
              .then(() => {
                setLoading(false);
                dispatch(setshowToast(true));
                dispatch(settoastMessage("Successfully Created User"));
                dispatch(settoastType("success"));
                closeForm();
                axios
                  .get(
                    `${
                      import.meta.env.VITE_API_DASHBOARD_URL
                    }/roles/?client=${client_id}`
                  )
                  .then((res) => {
                    dispatch(setUsers(res.data));
                  });
              });
          });
      })
      .catch((error) => {
        const error_message = error.response.data.message;
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            error_message ? error_message : "Failed to Create User"
          )
        );
        dispatch(settoastType("error"));
      });
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Tooltip title="Create User">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create User
        </Button>
      </Tooltip>
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleCreateUser}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="email"
                  name="email"
                  autoComplete="email"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  id="user-roles"
                  options={roles}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select User Role"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      size="small"
                      required
                    />
                  )}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputValue(newValue);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Create User"}
                  {loading ? <CircularProgress /> : null}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}

UserForm.propTypes = {
  client_id: PropTypes.string,
};
