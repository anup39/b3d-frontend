import { Tooltip, IconButton } from "@mui/material";
import PolylineIcon from "@mui/icons-material/Polyline";

export default function DrawPolygon() {
  return (
    <div>
      <Tooltip title="Draw a Polygon">
        <IconButton
          id="polygon-box"
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
              color: "#9C27B0",
            },
          }}
          aria-label="Draw a Polygon"
        >
          <PolylineIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
