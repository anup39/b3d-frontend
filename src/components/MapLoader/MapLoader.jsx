import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function MapLoader() {
  return (
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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: "20px",
          zIndex: 10000,
        }}
      >
        <Box>
          <CircularProgress sx={{ margin: 2 }} />
          <Typography sx={{ marginLeft: 1 }}>Saving..</Typography>
        </Box>
      </div>
    </div>
  );
}
