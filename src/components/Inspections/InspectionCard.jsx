import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import TabIcon from "@mui/icons-material/Tab";
import { useTranslation } from "react-i18next";

export default function InspectionCard({
  full_name,
  description,
  fill_color,
  fill_opacity,
  stroke_color,
  stroke_width,
}) {
  const { t } = useTranslation();
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
          <TabIcon sx={{ width: 30, height: 30, color: "green" }} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>{full_name}</b>
              </Typography>
              <Typography variant="body2" gutterBottom>
                {description}
              </Typography>
              <>
                <Typography variant="body2" gutterBottom>
                  <span>{t("Fill") + " " + t("Color")}: </span>
                  <span
                    style={{
                      color: fill_color,
                      backgroundColor: fill_color,
                    }}
                  >
                    {fill_color}
                  </span>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <span>{t("Fill") + " " + t("Opacity")}: </span>

                  {fill_opacity}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <span>{t("Stroke") + " " + t("Color")}: </span>
                  <span
                    style={{
                      color: stroke_color,
                      backgroundColor: stroke_color,
                    }}
                  >
                    {stroke_color}
                  </span>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <span>{t("Stroke") + " " + t("Width")}: </span>
                  {stroke_width}
                </Typography>
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

InspectionCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  full_name: PropTypes.string,
  description: PropTypes.string,
  fill_color: PropTypes.string,
  fill_opacity: PropTypes.string,
  stroke_color: PropTypes.string,
  stroke_width: PropTypes.number,
  created_at: PropTypes.string,
};
