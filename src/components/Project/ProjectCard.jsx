import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import FolderIcon from "@mui/icons-material/Folder";
import MapIcon from "@mui/icons-material/Map";
import Tooltip from "@mui/material/Tooltip";
import RoofingIcon from "@mui/icons-material/Roofing";

// import {
//   setdeleteId,
//   setdeletePopupMessage,
//   setdeleteTarget,
//   setshowDeletePopup,
// } from "../../reducers/DisplaySettings";

export default function ProjectCard({
  id,
  client_id,
  name,
  client_name,
  description,
}) {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [properties, setproperties] = useState([]);
  const [users, setusers] = useState([]);

  // Remaining things to do :
  // const handleViewInMap = () => {
  //   navigate(`/map/project/${id}`);
  // };

  // const handleManageUsers = () => {
  //   navigate(`/manage-users/${id}`);
  // };

  // const handleDeleteProject = () => {
  //   dispatch(setshowDeletePopup(true));
  //   dispatch(setdeleteId(id));
  //   dispatch(setdeleteTarget("projects"));
  //   dispatch(
  //     setdeletePopupMessage(
  //       `Are you sure you want to delete Project ${id} and its content?`
  //     )
  //   );
  // };

  const handleInspection = () => {
    navigate(`/projects/${client_id}/inspections/${id}`);
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${id}`
      )
      .then((res) => {
        setproperties(res.data);
      });
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/roles/?project=${id}`)
      .then((res) => {
        setusers(res.data);
      });
  }, [id]);

  const handleViewInMap = () => {
    // dispatch(setshowMeasuringsPanel(false));
    // navigate(`/projects/${id}/Map`);
    window.location.replace(`/properties/${client_id}/${id}/Map`);
  };

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
          <FolderIcon sx={{ width: 128, height: 128, color: "#65C9FF" }} />
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
              <Typography variant="body2" gutterBottom>
                Client Name : {client_name}
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
                <Tooltip title="Inspection">
                  <RoofingIcon
                    onClick={handleInspection}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  />
                </Tooltip>
              </Grid>

              {/* <Grid item>
                <button
                  disabled
                  className="btn-main"
                  // onClick={handleManageUsers}
                >
                  Manage Users
                </button>
              </Grid> */}
              {/* <Grid item> */}
              {/* <button className="btn-main" onClick={handleDeleteProject}>
                  Delete
                </button> */}
              {/* </Grid> */}
            </Grid>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              Total Maps: {properties.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Total Users: {users.length} */}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{ marginTop: "25px" }}
              variant="contained"
              color="success"
              id="orthoButton"
              onClick={() => {
                navigate(`/properties/${client_id}/${id}/List`);
              }}
            >
              Manage Maps
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

ProjectCard.propTypes = {
  client_id: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  client_name: PropTypes.string,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
