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
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setProjects } from "../reducers/Project";
import axios from "axios";

export default function DashBoard() {
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const projects = useSelector((state) => state.project.projects);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/`)
      .then((res) => {
        dispatch(setProjects(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

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
        {projects
          ? projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                created_at={project.created_at}
              />
            ))
          : null}
      </div>
    </div>
  );
}
