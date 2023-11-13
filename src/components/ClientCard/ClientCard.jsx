import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeletePopup,
} from "../../reducers/DisplaySettings";
import FolderIcon from "@mui/icons-material/Folder";

export default function ClientCard({ id, name, description, created_at }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orthophotos, setOrthophotos] = useState([]);
  //   const [totalUsers, setTotalUsers] = useState(0);
  //   const [admin, setAdmin] = useState(0);
  //   const [editor, setEditor] = useState(0);
  //   const [basic, setBasic] = useState(0);

  const handleViewInMap = () => {
    navigate(`/map/${id}`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  const handleManageUsers = () => {
    navigate(`/manage-users/${id}`);
  };

  const handleManageStyles = () => {
    navigate(`/manage-styles/${id}`);
  };

  const handleDeleteProject = () => {
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
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?client=${id}`
      )
      .then((res) => {
        setOrthophotos(res.data);
      });
  }, [id]);

  // TODO: Do this later since we removed t he User Projects and we now have User Roles in database

  //   useEffect(() => {
  //     axios
  //       .get(
  //         `${import.meta.env.VITE_API_DASHBOARD_URL}/user-projects/?project=${id}`
  //       )
  //       .then((res) => {
  //         setTotalUsers(res.data.length);
  //         const counts = res.data.reduce((acc, item) => {
  //           const { role_name } = item;
  //           acc[role_name] = (acc[role_name] || 0) + 1;
  //           return acc;
  //         }, {});
  //         setAdmin(counts.admin ? counts.admin : 0);
  //         setEditor(counts.editor ? counts.editor : 0);
  //         setBasic(counts.basic ? counts.basic : 0);
  //       });
  //   }, [id]);

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
              <Typography variant="body2" color="text.secondary">
                Created At: {created_at}
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
              {/* <Grid item>
                <button className="btn-main" onClick={handleManageStyles}>
                  Manage Styles
                </button>
              </Grid> */}
              <Grid item>
                <button className="btn-main" onClick={handleDeleteProject}>
                  Delete
                </button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              Total Orthophotos: {orthophotos.length}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              Total Users: {totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin : {admin}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Editor : {editor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Basic : {basic}
            </Typography> */}
          </Grid>

          <Grid item>
            {/* <Button
              sx={{ marginTop: "25px" }}
              variant="contained"
              color="success"
              id="orthoButton"
              size="small"
              onClick={() => {
                navigate(`/orthophotos/${id}`);
              }}
            >
              Orthophotos
            </Button> */}
            <Button variant="contained" color="success">
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
