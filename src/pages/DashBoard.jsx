import * as React from "react";
import AppBar from "../components/AppBar/AppBar";
import { Button } from "@mui/material";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function DashBoard() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <div>
      <AppBar />

      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button
            onClick={handleOpenUserMenu}
            sx={{ margin: "5px" }}
            variant="contained"
            color="error"
          >
            Create Project
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: "50px", maxWidth: "250px" }}
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
          <MenuItem>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  fullWidth
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  fullWidth
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  // onClick={handleOpenUserMenu}
                  sx={{ margin: "5px" }}
                  variant="contained"
                  color="success"
                >
                  Create Project
                </Button>
              </Grid>
            </Grid>
          </MenuItem>
        </Menu>
      </Box>
      <div>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
}
