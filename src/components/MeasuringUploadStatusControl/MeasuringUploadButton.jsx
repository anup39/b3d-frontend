import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import { useDispatch, useSelector } from "react-redux";
import { setShowMeasuringFileUploadPanel } from "../../reducers/MapView";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

export default function MeasuringUploadButton({ measuringsUploadingCount }) {
  const dispatch = useDispatch();
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.showMeasuringUploadPanel
  );

  return (
    <div>
      <Box>
        <IconButton
          onClick={() => {
            dispatch(
              setShowMeasuringFileUploadPanel(!showMeasuringFileUploadPanel)
            );
            console.log("MeasuringUploadButton clicked");
          }}
        >
          <Tooltip title="Measuring Data Import Status">
            <Badge badgeContent={measuringsUploadingCount} color="secondary">
              <DriveFolderUploadIcon sx={{ color: "red", fontSize: 24 }} />
            </Badge>
          </Tooltip>
        </IconButton>
      </Box>
    </div>
  );
}

MeasuringUploadButton.propTypes = {
  measuringsUploadingCount: PropTypes.number,
};
