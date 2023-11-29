import LayersControlNew from "./LayerControlNew";
import Cancel from "../DrawControl/Cancel";
import DrawPolygon from "../DrawControl/DrawPolygon";
import Save from "../DrawControl/Save";
import { Typography } from "@mui/material";
export default function LayersAndLabelControl() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ backgroundColor: "#F1F7FF" }}>Measurings</Typography>
      <LayersControlNew />
    </div>
  );
}
