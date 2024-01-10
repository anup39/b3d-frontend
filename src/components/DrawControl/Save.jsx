import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import {
  setshowErrorPopup,
  setshowGeomFormPopup,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import { setshowMapLoader } from "../../reducers/MapView";

export default function Save() {
  const dispatch = useDispatch();
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const type_of_geometry = useSelector(
    (state) => state.drawnPolygon.type_of_geometry
  );
  const category_id = useSelector((state) => state.drawnPolygon.category_id);
  const handleSave = () => {
    if (wkt_geometry && type_of_geometry && category_id) {
      // dispatch(setshowGeomFormPopup("block"));
      dispatch(setshowMapLoader(true));
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("info"));
      dispatch(
        settoastMessage("No category drawn in map. Please draw category")
      );
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
