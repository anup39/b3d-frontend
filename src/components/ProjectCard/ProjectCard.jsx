import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function ProjectCard({ id, name, description, created_at }) {
  const navigate = useNavigate();
  const [orthophotos, setOrthophotos] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [admin, setAdmin] = useState(0);
  const [editor, setEditor] = useState(0);
  const [basic, setBasic] = useState(0);

  const handleViewInMap = () => {
    navigate(`/map/${id}`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  const handleManageUsers = () => {
    navigate(`/manage-users/${id}`);
  };
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${id}`
      )
      .then((res) => {
        setOrthophotos(res.data);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/user-projects/?project=${id}`
      )
      .then((res) => {
        setTotalUsers(res.data.length);
        const counts = res.data.reduce((acc, item) => {
          const { role_name } = item;
          acc[role_name] = (acc[role_name] || 0) + 1;
          return acc;
        }, {});
        setAdmin(counts.admin ? counts.admin : 0);
        setEditor(counts.editor ? counts.editor : 0);
        setBasic(counts.basic ? counts.basic : 0);
      });
  }, [id]);

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
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img
              alt="complex"
              src="https://cdn-icons-png.flaticon.com/512/4212/4212570.png"
            />
          </ButtonBase>
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
                Created On: {created_at}
              </Typography>
            </Grid>
            <Grid item xs container direction="row" spacing={2}>
              <Grid item>
                <Button
                  onClick={handleViewInMap}
                  variant="contained"
                  color="success"
                >
                  View In Map
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleManageClasses}
                  variant="contained"
                  color="success"
                >
                  Manage Classes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleManageUsers}
                  variant="contained"
                  color="success"
                >
                  Manage Users
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              Total Orthophotos: {orthophotos.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
            </Typography>
          </Grid>

          <Grid item>
            <Button
              sx={{ marginTop: "25px" }}
              variant="contained"
              color="success"
              id="orthoButton"
              onClick={() => {
                navigate(`/orthophotos/${id}`);
              }}
            >
              Orthophotos
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

ProjectCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
