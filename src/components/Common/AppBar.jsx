import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserId, setUserName } from "../../reducers/Auth";

const pagesSuperAdmin = [
  "Clients",
  "Classification",
  "InspectionType",
  "About",
  "Contact",
];

const pagesAdmin = ["Clients", "About", "Contact"];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Appbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { username } = useSelector((state) => state.auth);

  const role = useSelector((state) => state.auth.role);
  const group_name = useSelector((state) => state.auth.role.group_name);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    const page = event.target.innerHTML;
    if (page.toUpperCase() === "CLASSIFICATION") {
      navigate("/class");
    }
    if (page.toUpperCase() === "CLIENTS") {
      navigate("/dashboard");
    }
    if (page.toUpperCase() === "INSPECTIONTYPE") {
      navigate("/inspection-type");
    }
    setAnchorElNav(null);
  };

  const handleCloseNavMenuButton = (event) => {
    const page = event.target.innerText;
    if (page.toUpperCase() === "CLASSIFICATION") {
      navigate("/class");
    }
    if (page.toUpperCase() === "CLIENTS") {
      navigate("/dashboard");
    }
    if (page.toUpperCase() === "INSPECTIONTYPE") {
      navigate("/inspection-type");
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event) => {
    if (event.target.innerHTML === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      dispatch(setToken(""));
      dispatch(setUserId(""));
      dispatch(setUserName(""));
      navigate("/");
      window.location.reload(true);
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar
      sx={{ backgroundColor: "#F1F7FF", color: "black", boxShadow: "none" }}
      position="sticky"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#027FFE",
              textDecoration: "none",
            }}
          >
            B3D
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {group_name === "super_admin"
                ? pagesSuperAdmin.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography sx={{ color: "#027FFE" }} textAlign="center">
                        {page}
                      </Typography>
                    </MenuItem>
                  ))
                : pagesAdmin.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography sx={{ color: "#027FFE" }} textAlign="center">
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#027FFE",
              textDecoration: "none",
            }}
          >
            B3D
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              color: "black",
            }}
          >
            {group_name === "super_admin"
              ? pagesSuperAdmin.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenuButton}
                    sx={{ my: 2, color: "#027FFE", display: "block" }}
                  >
                    {page}
                  </Button>
                ))
              : pagesAdmin.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenuButton}
                    sx={{ my: 2, color: "#027FFE", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>{username}</Typography>
            <Typography>
              <b>Role:</b> {role?.group_name}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/avatar.webp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Appbar;
