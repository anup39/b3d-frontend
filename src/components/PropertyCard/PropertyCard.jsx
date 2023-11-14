import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LinearProgressLabel from "../ProgressBar/LinearProgressLabel";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2);
}

export default function PropertyCard({
  id,
  name,
  status,
  file_size,
  progress,
  created_at,
  task_id,
  file_name,
  projection,
  thumbnail,
  client_name,
  project_name,
}) {
  const navigate = useNavigate();
  const handleViewInMapProperty = () => {
    console.log("map");
  };
  const handleDeleteProperty = () => {
    console.log("Delete ", id);
    navigate(`/map/${id}`);
  };

  const handleReprocessProperty = () => {
    // navigate(`/map/${id}`);
    console.log("Reprocess", id);
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
          <ButtonBase sx={{ width: 300, height: 200 }}>
            <Img alt="complex" src={thumbnail} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>Name </b>: {name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>File Name</b> : {file_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Projection </b>: {projection}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>File size </b>: {bytesToMB(file_size)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Created At </b>: {created_at}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Task ID</b>: {task_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Status </b>: {status}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Client Name </b>: {client_name}
              </Typography>{" "}
              <Typography variant="body2" gutterBottom>
                <b>Project Name </b>: {project_name}
              </Typography>
              <LinearProgressLabel value={progress}></LinearProgressLabel>
            </Grid>
            <Grid item xs container direction="row" spacing={2}>
              <Grid item>
                <button className="btn-main" onClick={handleViewInMapProperty}>
                  View In Map
                </button>
              </Grid>
              <Grid item>
                <button className="btn-main" onClick={handleReprocessProperty}>
                  Reprocess
                </button>
              </Grid>
              <Grid item>
                <button className="btn-main" onClick={handleDeleteProperty}>
                  Delete
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

PropertyCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.string,
  file_size: PropTypes.number,
  progress: PropTypes.number,
  created_at: PropTypes.string,
  task_id: PropTypes.string,
  file_name: PropTypes.string,
  projection: PropTypes.string,
  thumbnail: PropTypes.string,
  client_name: PropTypes.string,
  project_name: PropTypes.string,
};
