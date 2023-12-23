import LayersControlPanel from "./LayerControlPanel";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BackupIcon from "@mui/icons-material/Backup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreLess from "@mui/icons-material/ExpandLess";
import { pink } from "@mui/material/colors";
import { useState } from "react";

export default function LayersAndLabelControl({ map }) {
  const [expandMeasurings, setExpandMeasurings] = useState(true);

  const handleCloseMeasurings = () => {
    setExpandMeasurings(!expandMeasurings);
  };
  return (
    <div
      className="maplibregl-ctrl-layer-control"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              backgroundColor: "white",
              fontWeight: "bold",
              marginTop: 1,
              marginBottom: 0,
              paddingTop: 0,
              marginLeft: 2,
              fontSize: "14px",
              color: "#027FFE",
            }}
          >
            Measurings :{" "}
            <span style={{ color: "#757575", marginRight: "20px" }}>
              Map nov
            </span>
          </Typography>
          <Box></Box>

          <Tooltip title="Report">
            <SummarizeIcon
              sx={{
                "&:hover": { cursor: "pointer" },
                mt: 1,
                mr: 2,
                color: "#d61b60",
              }}
            />
          </Tooltip>
          <Tooltip title="Export">
            <BackupIcon
              sx={{
                "&:hover": { cursor: "pointer" },
                mt: 1,
                mr: 1,
                color: "#d61b60",
              }}
            />
          </Tooltip>
        </Box>

        {expandMeasurings ? <LayersControlPanel map={map} /> : null}

        {expandMeasurings ? (
          <ExpandMoreLess
            onClick={handleCloseMeasurings}
            sx={{
              ml: "50%",
              "&:hover": {
                cursor: "pointer",
              },
              color: pink[600],
            }}
          />
        ) : (
          <ExpandMoreIcon
            onClick={handleCloseMeasurings}
            sx={{
              ml: "50%",
              "&:hover": {
                cursor: "pointer",
              },
              color: pink[600],
            }}
          />
        )}
      </Box>
    </div>
  );
}

LayersAndLabelControl.propTypes = {
  map: PropTypes.object,
};
