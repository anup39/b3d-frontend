import { Tooltip, IconButton } from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

export default function Point() {
  return (
    <div>
      <Tooltip title="Draw a Point">
        <IconButton
          id="point-box"
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
              color: "#9C27B0",
            },
          }}
          aria-label="Draw a Point"
        >
          <GpsFixedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
