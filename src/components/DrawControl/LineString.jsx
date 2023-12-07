import { Tooltip, IconButton } from "@mui/material";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

export default function LineString() {
  return (
    <div>
      <Tooltip title="Draw a LineString">
        <IconButton
          id="linestring-box"
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
              color: "#9C27B0",
            },
          }}
          aria-label="Draw a LineString"
        >
          <HighlightAltIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
