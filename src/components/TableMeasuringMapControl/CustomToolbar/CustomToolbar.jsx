import {
  GridToolbarContainer,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { config } from "./config";
import { Button, Tooltip, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTranslation } from "react-i18next";
import { setshowTableMeasurings } from "../../../reducers/MapView";
import { useDispatch } from "react-redux";
import SaveALtIcon from "@mui/icons-material/SaveAlt";

function CustomToolbar(props, showCloseButton) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiRef = useGridApiContext();
  const { hideMenu } = props;
  function getExcelData(apiRef) {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

    // Format the data. Here we only keep the value
    const data = filteredSortedRowIds.map((id) => {
      const row = {};
      visibleColumnsField.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).value;
      });
      return row;
    });

    return data;
  }

  function handleExport(apiRef) {
    const data = getExcelData(apiRef);
    const rows = data.map((row) => {
      const mRow = {};
      for (const key of config.keys) {
        if (key == "type_of_geometry" || key == "color") {
          if (key == "type_of_geometry")
            mRow["type_of_geometry"] =
              row["symbol"]["type_of_geometry"] == ""
                ? "title"
                : row["symbol"]["type_of_geometry"];
          if (key == "color") mRow["color"] = row["symbol"]["color"];
          continue;
        }
        mRow[key] = row[key];
      }
      return mRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(worksheet, [[...config.columnNames]], {
      origin: "A1",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);
    XLSX.writeFile(workbook, config.fileName, { compression: true });
  }
  return (
    <GridToolbarContainer
      style={{
        padding: "0.5rem",
        borderBottom: "2px solid #CCC",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      {...props}
    >
      <Typography
        sx={{
          padding: 0,
          color: "#2B8AFF",
          fontWeight: 600,
          ml: `0.5rem`,
        }}
      >
        {t("Table")} {t("Represents")} {t("Area")} in meter square(m²)
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <Tooltip placement="top-end" title={t("Export Excel")}>
          <Button
            onClick={() => {
              handleExport(apiRef);
              // Hide the export menu after the export
              hideMenu?.();
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.2rem",
                alignItems: "center",
              }}
            >
              <SaveALtIcon sx={{ width: "18px", height: "18px" }} />
              <span style={{ fontSize: "0.9rem" }}>Export</span>
            </div>
          </Button>
        </Tooltip>

        {showCloseButton && (
          <Tooltip placement="top-end" title={t("Close")}>
            <HighlightOffIcon
              onClick={() => {
                dispatch(setshowTableMeasurings(false));
              }}
              sx={{
                float: "right",
                color: "#E91E62",
                "&:hover": { cursor: "pointer" },
              }}
            />
          </Tooltip>
        )}
      </div>
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
