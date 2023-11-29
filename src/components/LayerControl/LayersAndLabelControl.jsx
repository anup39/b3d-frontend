import LayersControlPanel from "./LayerControlPanel";
import { Typography } from "@mui/material";
export default function LayersAndLabelControl() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          backgroundColor: "#F1F7FF",
          fontWeight: "bold",
          position: "sticky",
        }}
      >
        Measurings
      </Typography>
      <LayersControlPanel />
    </div>
  );
}
