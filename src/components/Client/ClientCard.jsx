import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeletePopup,
} from "../../reducers/DisplaySettings";
import FolderIcon from "@mui/icons-material/Folder";
import { setprojects } from "../../reducers/Project";
import MapIcon from "@mui/icons-material/Map";
import Tooltip from "@mui/material/Tooltip";
import AppsIcon from "@mui/icons-material/Apps";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
// import { setshowMeasuringsPanel } from "../../reducers/MapView";

export default function ClientCard({ id, name, description }) {
  const [properties, setproperties] = useState([]);
  const [users, setusers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.project.projects);

  const handleViewInMap = () => {
    // dispatch(setshowMeasuringsPanel(false));
    // navigate(`/projects/${id}/Map`);
    window.location.replace(`/projects/${id}/Map`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  const handleManageUsers = () => {
    navigate(`/manage-users/${id}`);
  };

  const handleOpenClient = () => {
    navigate(`/projects/${id}/List`);
  };

  const handleDeleteClient = () => {
    dispatch(setshowDeletePopup(true));
    dispatch(setdeleteId(id));
    dispatch(setdeleteTarget("clients"));
    dispatch(
      setdeletePopupMessage(
        `Are you sure you want to delete Client ${id} and its content?`
      )
    );
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/?client=${id}`)
      .then((res) => {
        setprojects(res.data);
      });
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?client=${id}`
      )
      .then((res) => {
        setproperties(res.data);
      });
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/roles/?client=${id}`)
      .then((res) => {
        setusers(res.data);
      });
  }, [id, dispatch]);

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
        <Grid item>
          <FolderIcon sx={{ width: 128, height: 128, color: "#23C9C9" }} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {description}
              </Typography>
            </Grid>
            <Grid item xs container direction="row" spacing={1}>
              <Grid item>
                <Tooltip title="MapView">
                  <MapIcon
                    onClick={handleViewInMap}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Manage Class">
                  <AppsIcon
                    onClick={handleManageClasses}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Manage Users">
                  <PeopleIcon
                    onClick={handleManageUsers}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Delete Client">
                  <DeleteIcon
                    onClick={handleDeleteClient}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              Total Properties: {projects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Maps: {properties.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users : {users.length}
            </Typography>
          </Grid>

          <Grid item>
            <Button
              onClick={handleOpenClient}
              variant="contained"
              color="success"
            >
              Open
            </Button>
          </Grid>
        </Grid>{" "}
      </Grid>
    </Paper>
  );
}

ClientCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
