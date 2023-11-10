import Grid from "@mui/material/Grid";
import LinearProgressLabel from "../ProgressBar/LinearProgressLabel";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

export default function UploadProgress({
  isProgressFormOpen,
  onProgressForm,
  progress,
}) {
  return (
    <>
      {isProgressFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <form
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
            }}
          >
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Uploading ... Please Wait:
              </Typography>
            </Grid>
            <LinearProgressLabel value={progress}></LinearProgressLabel>

            <Grid item xs={12}>
              <Button
                onClick={() => {
                  onProgressForm(false);
                }}
                variant="contained"
                color="error"
                size="small"
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}

UploadProgress.propTypes = {
  isProgressFormOpen: PropTypes.bool,
  progress: PropTypes.number,
  onProgressForm: PropTypes.func,
};
