import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Register() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/register/`, data)
      .then(function (res) {
        axios
          .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/`, {
            user: res.data.id,
            role: 1,
          })
          .then(function () {
            setLoading(false);
            dispatch(setshowToast(true));
            dispatch(settoastMessage("Successfully Created User"));
            dispatch(settoastType("success"));
            navigate("/users");
          })
          .catch(() => {
            setLoading(false);
            dispatch(setshowToast(true));
            dispatch(settoastMessage("Failed to Create User"));
            dispatch(settoastType("error"));
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <HowToRegOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant={loading ? "outlined" : "contained"}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? null : "Register"}
              {loading ? <CircularProgress /> : null}
            </Button>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
