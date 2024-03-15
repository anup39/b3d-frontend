import { Tooltip, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setId,
  setTypeOfGeometry,
  setWKTGeometry,
  setViewName,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import { useDispatch, useSelector } from "react-redux";

export default function Cancel() {
  const dispatch = useDispatch();
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const view_name = useSelector((state) => state.drawnPolygon.view_name);
  const mode = useSelector((state) => state.drawnPolygon.mode);
  const handleCancelDraw = () => {
    if (window.map_global) {
      const draw = window.map_global.draw;
      if (mode === "Edit") {
        const layerId = String(client_id) + view_name + "layer";
        window.map_global.setFilter(layerId, null);
      }
      draw.deleteAll();
      draw.changeMode("simple_select");
      dispatch(setWKTGeometry(null));
      dispatch(setTypeOfGeometry(null));
      dispatch(setId(null));
      dispatch(setViewName(null));
      dispatch(setMode(null));
      dispatch(setFeatureId(null));
      dispatch(setComponent(null));
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
