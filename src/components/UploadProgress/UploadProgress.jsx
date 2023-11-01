import Grid from "@mui/material/Grid";
import { useState } from "react";
import LinearProgressLabel from "../ProgressBar/LinearProgressLabel";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function UploadProgress({
  isProgressFormOpen,
  onProgressForm,
  progress,
}) {
  console.log(isProgressFormOpen, "on progress form");
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
            background: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
            zIndex: 9999, // Higher z-index to cover other elements
          }}
        >
          <form
            // onSubmit={handleCreateraster}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px", // Adjust the width to your desired size
              background: "#fff",
              padding: "20px",
              zIndex: 10000, // Higher z-index for the form
            }}
          >
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Progress:
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
                fullWidth // Use fullWidth to make the button occupy the form's width
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
