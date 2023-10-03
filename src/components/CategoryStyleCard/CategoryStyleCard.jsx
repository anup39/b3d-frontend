import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function CategoryStyleCard({
  id,
  full_name,
  fill_color,
  fill_opacity,
  stroke_color,
  stroke_width,
  created_at,
}) {
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
          <ButtonBase sx={{ width: 100, height: 100 }}>
            <Img
              alt="complex"
              src="https://cdn-icons-png.flaticon.com/512/4643/4643966.png"
            />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {full_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>
                  <span>Fill Color: </span>
                </b>
                <span style={{ backgroundColor: fill_color }}>
                  {fill_color}
                </span>
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>
                  <span>Fill Opacity: </span>
                </b>
                {fill_opacity}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>
                  <span>Stroke Color: </span>
                </b>
                <span style={{ backgroundColor: stroke_color }}>
                  {stroke_color}
                </span>
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>
                  <span>Stroke Width: </span>
                </b>
                {stroke_width}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created On: {created_at}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

CategoryStyleCard.propTypes = {
  id: PropTypes.number,
  full_name: PropTypes.string,
  fill_color: PropTypes.string,
  fill_opacity: PropTypes.string,
  stroke_color: PropTypes.string,
  stroke_width: PropTypes.number,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
