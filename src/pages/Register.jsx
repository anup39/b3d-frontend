import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const [openRegisterErrorToast, setOpenRegisterErrorToast] = useState(false);
  const [openRegisterSuccessToast, setOpenRegisterSuccessToast] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/register/`, data)
      .then(function () {
        setOpenRegisterSuccessToast(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch(() => setOpenRegisterErrorToast(true));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openRegisterErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create User"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create User
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openRegisterSuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created User"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created User
        </Alert>
      </Snackbar>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
