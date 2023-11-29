import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeletePopup,
} from "../../reducers/DisplaySettings";
import FolderIcon from "@mui/icons-material/Folder";
export default function ClientCard({ id, name, description }) {
  const [properties, setproperties] = useState([]);
  const [projects, setprojects] = useState([]);
  const [users, setusers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewInMap = () => {
    // #use client id
    navigate(`/map/client/${id}`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  const handleManageUsers = () => {
    navigate(`/manage-users/${id}`);
  };

  const handleOpenClient = () => {
    console.log(id, "id");
    navigate(`/projects/${id}`);
  };

  const handleDeleteClient = () => {
    dispatch(setshowDeletePopup(true));
    dispatch(setdeleteId(id));
    dispatch(setdeleteTarget("clients"));
    ``;
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
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/?client=${id}`)
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
                <button className="btn-main" onClick={handleViewInMap}>
                  View In Map
                </button>
              </Grid>
              <Grid item>
                <button className="btn-main" onClick={handleManageClasses}>
                  Manage Classes
                </button>
              </Grid>
              <Grid item>
                <button className="btn-main" onClick={handleManageUsers}>
                  Manage Users
                </button>
              </Grid>
              <Grid item>
                <button className="btn-main" onClick={handleDeleteClient}>
                  Delete
                </button>
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
        </Grid>
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
