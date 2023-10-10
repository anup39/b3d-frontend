import { Tooltip, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { setWKTGeometry } from "../../reducers/DrawnPolygon";
import { useDispatch } from "react-redux";

export default function Cancel() {
  const dispatch = useDispatch();
  const handleCancelDraw = () => {
    if (window.map_global) {
      const drawInstance = window.map_global.draw;
      drawInstance.deleteAll();
      drawInstance.changeMode("simple_select");
      dispatch(setWKTGeometry(null));
    }
  };
  return (
    <div>
      <Tooltip title="Cancel">
        <IconButton
          onClick={handleCancelDraw}
          id="cancel-draw"
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
              color: "#9C27B0",
            },
          }}
          aria-label="Cancel"
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
