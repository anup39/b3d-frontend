import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import { useDispatch, useSelector } from "react-redux";
import { setShowMeasuringFileUploadPanel } from "../../reducers/MapView";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function MeasuringUploadButton({ measuringsUploadingCount }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const project_id = useSelector((state) => state.project.project_id);
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.showMeasuringUploadPanel
  );

  return (
    <div>
      {project_id ? (
        <Box>
          <IconButton
            onClick={() => {
              dispatch(
                setShowMeasuringFileUploadPanel(!showMeasuringFileUploadPanel)
              );
              console.log("MeasuringUploadButton clicked");
            }}
          >
            <Tooltip
              title={t("Measurings") + " " + t("Upload") + " " + t("Status")}
            >
              <Badge badgeContent={measuringsUploadingCount} color="secondary">
                <DriveFolderUploadIcon sx={{ color: "red", fontSize: 24 }} />
              </Badge>
            </Tooltip>
          </IconButton>
        </Box>
      ) : null}
    </div>
  );
}

MeasuringUploadButton.propTypes = {
  measuringsUploadingCount: PropTypes.number,
};
