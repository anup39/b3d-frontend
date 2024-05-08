import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { setShowMeasuringFileUploadPanel } from "../../reducers/MapView";
import { useTranslation } from "react-i18next";

export default function MeasuringUploadCancelButton() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <Box>
        <Tooltip placement="top-end" title={t("Close")}>
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
