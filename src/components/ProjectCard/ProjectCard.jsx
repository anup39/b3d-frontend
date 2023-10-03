import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function ProjectCard({ id, name, description, created_at }) {
  const navigate = useNavigate();
  const handleViewInMap = () => {
    console.log("View in Map is clicked");
    console.log(id, "project id ");
    navigate("/map");
  };
  const handleUploadRaster = () => {
    console.log("Upload in Map is clicked");
  };
  return (
    <Paper
      sx={{
        p: 2,
        margin: 2,
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
            <Grid item>
              <Button
                onClick={handleViewInMap}
                variant="contained"
                color="success"
              >
                View In Map
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              onClick={handleUploadRaster}
              variant="contained"
              color="error"
            >
              Upload Raster
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
