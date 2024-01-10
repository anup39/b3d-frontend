import { Tooltip, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setCategoryId,
  setTypeOfGeometry,
  setWKTGeometry,
  setCategoryViewName,
} from "../../reducers/DrawnGeometry";
import { useDispatch } from "react-redux";

export default function Cancel() {
  const dispatch = useDispatch();
  const handleCancelDraw = () => {
    if (window.map_global) {
      const draw = window.map_global.draw;
      draw.deleteAll();
      draw.changeMode("simple_select");
      dispatch(setWKTGeometry(null));
      dispatch(setTypeOfGeometry(null));
      dispatch(setCategoryId(null));
      dispatch(setCategoryViewName(null));
    }
  };
  return (
    <div>
      <Tooltip title="Cancel">
        <IconButton
          onClick={handleCancelDraw}
          id="cancel-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Cancel"
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
