import { GridToolbarContainer } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { ExportButton } from "./ExportButton";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";

function CustomToolbar(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <GridToolbarContainer {...props}>
      {/* <Typography
        sx={{
          padding: 0,
          color: "#2B8AFF",
          fontWeight: 600,
          ml: `0.5rem`,
        }}
      >
        {t("Table")} {t("Represents")} {t("Area")} in meter square(m²)
      </Typography> */}
      <ExportButton />

      {/* <Tooltip placement="top-end" title={t("Close")}>
        <HighlightOffIcon
          onClick={() => {
            dispatch(setshowTableMeasurings(false));
          }}
          sx={{
            float: "right",
            color: "#E91E62",
            "&:hover": { cursor: "pointer" },
            mt: 0.5,
          }}
        />
      </Tooltip> */}
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
