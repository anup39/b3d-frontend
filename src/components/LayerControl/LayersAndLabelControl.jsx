import LayersControlPanel from "./LayerControlPanel";
import { Box, Typography } from "@mui/material";
import { PropTypes } from "prop-types";

export default function LayersAndLabelControl({ map }) {
  return (
    <div
      className="maplibregl-ctrl-layer-control"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Box>
        <Box>
          <Typography
            sx={{
              backgroundColor: "white",
              fontWeight: "bold",
              marginTop: 1,
              paddingTop: 0,
              marginLeft: 2,
              fontSize: "14px",
              color: "#027FFE",
            }}
          >
            Measurings : <span style={{ color: "#D71A60" }}>Map nov</span>
          </Typography>
        </Box>

        <LayersControlPanel map={map} />
      </Box>
    </div>
  );
}

LayersAndLabelControl.propTypes = {
  map: PropTypes.object,
};
