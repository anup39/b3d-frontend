import LayersControlPanel from "./LayerControlPanel";
import { Typography } from "@mui/material";
import { PropTypes } from "prop-types";

export default function LayersAndLabelControl({ map }) {
  return (
    <div
      className="maplibregl-ctrl-layer-control"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Typography
        sx={{
          backgroundColor: "#F1F7FF",
          fontWeight: "bold",
          position: "sticky",
        }}
      >
        Measurings
      </Typography>
      <LayersControlPanel map={map} />
    </div>
  );
}

LayersAndLabelControl.propTypes = {
  map: PropTypes.object,
};
