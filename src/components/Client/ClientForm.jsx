import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setclients } from "../../reducers/Client";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

export default function ClientForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-roles/`)
  //     .then((res) => {
  //       setRoles(res.data);
  //     })
  //     .then(() => {});
  // }, []);

  const handleCreateClient = (event) => {
    // TODO : Here handle the error since username and email  are checked in backend, also group is hardcore for role admin, since both id represens admin group for client
    event.preventDefault();
    setLoading(true);
    const data_ = new FormData(event.currentTarget);
    data_.append("created_by", user_id);
    data_.append("is_display", true);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, data_)
      .then((res) => {
        const client_data = res.data;
        const role_data = {
          name: client_data.name,
          user: client_data.user,
          client: client_data.id,
          group: 2,
          created_by: user_id,
          is_display: true,
        };
        axios
          .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/roles/`, role_data)
          .then(() => {
            setLoading(false);
            dispatch(setshowToast(true));
            dispatch(
              settoastMessage(
                `${t("Successfully")}  ${t("Created")}  ${t("Client")}  `
              )
            );
            dispatch(settoastType("success"));
            closeForm();
            axios
              .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, {
                // headers: {
                //   Authorization: "Token " + localStorage.getItem("token"), // Include the API token from localStorage in the 'Authorization' header
                // },
              })
              .then((res) => {
                dispatch(setclients(res.data));
              });
          });
      })
      .catch((error) => {
        const error_message = error.response.data.message;
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            error_message
              ? error_message
              : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
                  "Create"
                )} + " "+ ${t("Client")}`
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
      <Tooltip title={t("Create") + " " + t("Client")}>
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          {t("Create") + " " + t("Client")}
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
            onSubmit={handleCreateClient}
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
                  label={t("Username")}
                  name="username"
                  autoComplete="username"
                  autoFocus
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="firstname"
                  name="firstname"
                  label={t("Firstname")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="lastname"
                  name="lastname"
                  label={t("Lastname")}
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
                  label={t("Email")}
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
                  label={t("Password")}
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
                <TextField
                  id="description"
                  name="description"
                  label={t("Description")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : t("Create") + " " + t("Client")}
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
                  {t("Cancel")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
