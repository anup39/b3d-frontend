import Grid from "@mui/material/Grid";
import LinearProgressLabel from "../Property/LinearProgressLabel";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { setshowProgressFormOpen } from "../../reducers/Property";

export default function UploadProgress() {
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );
  const progress = useSelector((state) => state.property.progress);
  return (
    <>
      {showProgressFormOpen && (
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
                  setshowProgressFormOpen(false);
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

UploadProgress.propTypes = {};
