import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";

export default function InspectionCard({ inspection }) {
  console.log(inspection, "inspection");
  const { id, name, totalPhoto, inspectedPhoto, date } = inspection;
  return (
    <>
      <div key={id}>
        <Paper
          sx={{
            p: 1,
            margin: 1,
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
                </Grid>
                <Grid item xs container direction="row" spacing={1}>
                  <Grid item>
                    <Tooltip title="Share">
                      <ShareIcon sx={{ "&:hover": { cursor: "pointer" } }} />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Upload Photos">
                      <AddPhotoAlternateIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Report">
                      <AssessmentIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  Total Photos: {totalPhoto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inspected Photos: {inspectedPhoto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {date}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}

InspectionCard.propTypes = {
  inspection: PropTypes.object,
};
