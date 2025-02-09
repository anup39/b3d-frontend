import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUserId, setUserName, setRole } from "../reducers/Auth";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";

const defaultTheme = createTheme();

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/api-token-auth/`, data)
      .then(function (res) {
        const token = res.data.token;
        const user_id = res.data.user_id;
        const username = res.data.username;
        dispatch(setToken(token));
        dispatch(setUserId(user_id));
        dispatch(setUserName(username));

        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("username", username);

        dispatch(setshowToast(true));
        dispatch(settoastMessage(`${t("Welcome")} ${username}`));
        dispatch(settoastType("success"));
        axios
          .get(
            `${import.meta.env.VITE_API_DASHBOARD_URL}/roles/?user=${user_id}`
          )
          .then((res) => {
            console.log(res.data, "roles");
            dispatch(setRole(res.data[0]));
            localStorage.setItem("role", JSON.stringify(res.data[0]));
          });
        setLoading(false);
        navigate("/dashboard");
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Invalid Credentials"));
        dispatch(settoastType("error"));
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LanguageSwitcher />
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Login")}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("Username")}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Password")}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("Remember")}
            /> */}
            <Button
              type="submit"
              fullWidth
              variant={loading ? "outlined" : "contained"}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? null : t("Login")}
              {loading ? <CircularProgress /> : null}
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
            </Grid>
          </form>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
