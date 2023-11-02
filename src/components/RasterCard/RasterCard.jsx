import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LinearProgressLabel from "../ProgressBar/LinearProgressLabel";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2); // Keep two decimal places
}

export default function RasterCard({
  id,
  name,
  status,
  file_size,
  progress,
  created_on,
  task_id,
  file_name,
  projection,
  thubnail,
}) {
  const navigate = useNavigate();

  const handleDelete = () => {
    navigate(`/map/${id}`);
  };

  const handleReprocess = () => {
    navigate(`/map/${id}`);
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
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src={thubnail} />
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
                <b>Created On </b>: {created_on}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Task ID</b>: {task_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Status </b>: {status}
              </Typography>
              <LinearProgressLabel value={progress}></LinearProgressLabel>
            </Grid>
            <Grid item xs container direction="row" spacing={2}>
              <Grid item>
                <Button
                  // onClick={handleDelete}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
              </Grid>
              <Grid item>
                <Button
                  // onClick={handleReprocess}
                  variant="contained"
                  color="success"
                >
                  Reprocess
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

RasterCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.string,
  file_size: PropTypes.number,
  progress: PropTypes.number,
  created_on: PropTypes.string,
  task_id: PropTypes.string,
  file_name: PropTypes.string,
  projection: PropTypes.string,
  thubnail: PropTypes.string,
};
