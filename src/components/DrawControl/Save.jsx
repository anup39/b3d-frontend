import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { setshowGeomFormPopup } from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";

export default function Save() {
  const dispatch = useDispatch();
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const handleSave = () => {
    if (wkt_geometry) {
      dispatch(setshowGeomFormPopup("block"));
    }
  };
  return (
    <div>
      <Tooltip title="Save">
        <IconButton
          onClick={handleSave}
          id="save-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Save"
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
