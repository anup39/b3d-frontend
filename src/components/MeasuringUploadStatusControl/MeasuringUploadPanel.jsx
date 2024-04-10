import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { setShowMeasuringFileUploadPanel } from "../../reducers/MapView";
import Box from "@mui/material/Box";

export default function MeasuringUploadPanel() {
  const dispatch = useDispatch();
  return (
    <div>
      <Box>
        <Tooltip placement="top-end" title="Close Pie Chart">
          <HighlightOffIcon
            onClick={() => {
              dispatch(setShowMeasuringFileUploadPanel(false));
            }}
            sx={{
              float: "right",
              color: "#E91E62",
              "&:hover": { cursor: "pointer" },
              mt: 0.5,
            }}
          />
        </Tooltip>
      </Box>
    </div>
  );
}
