import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Tooltip, Button } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInspectionID } from "../../reducers/InspectionUpload";
import { setshowUploadInspection } from "../../reducers/DisplaySettings";

export default function InspectionCard({ inspection, client_id, project_id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, name, totalPhoto, inspectedPhoto, date } = inspection;

  // Here you will need to pass the id of the inpsection
  const handleUploadImage = (event, id) => {
    console.log("🚀 ~ handleUploadImage ~ id:", id);
    dispatch(setshowUploadInspection(true));
    dispatch(setInspectionID(id));
  };
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
                        onClick={(event) => handleUploadImage(event, id)}
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
              <Grid item>
                <Button
                  sx={{ marginTop: "25px" }}
                  variant="contained"
                  color="success"
                  id="orthoButton"
                  onClick={() => {
                    navigate(
                      `/projects/${client_id}/inspections/${project_id}/inspection/${inspection.id}`
                    );
                  }}
                >
                  View
                </Button>
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
