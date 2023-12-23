import {
  Grid,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ShapefileUpload() {
  const [loading, setLoading] = useState(false);
  return (
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
        // onSubmit={handleCreateClient}
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ color: "black" }}>
              Uploading Measuring for : <b>Map Nov</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload Shapefile or Geojson
              <VisuallyHiddenInput required type="file" />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant={loading ? "outlined" : "contained"}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? null : "Create Client"}
              {loading ? <CircularProgress /> : null}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              //   onClick={closeForm}
              variant="contained"
              color="error"
              size="small"
              fullWidth
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
