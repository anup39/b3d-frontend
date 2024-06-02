import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Pentagon from "@mui/icons-material/Pentagon";
import PropTypes from "prop-types";
import { setshowTableMeasurings } from "../../reducers/MapView";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import GridNoRowsOverlay from "./Norows";
import { useTranslation } from "react-i18next";

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  let icon;
  if (type_of_geometry === "Polygon") {
    icon = <Pentagon sx={{ color: color }} />;
  } else if (type_of_geometry === "Point") {
    icon = <CircleIcon sx={{ color: color }} />;
  } else {
    icon = <ShowChartIcon sx={{ color: color }} />;
  }

  return icon;
};

export default function TableMeasuringsForMap({
  width,
  showCloseButton,
  showHeading,
  marginLeftOfTitle,
  mode,
}) {
  const { t } = useTranslation();

  const columns = [
    {
      field: "symbol",
      headerName: `${t("Symbol")}`,
      type: "string",
      width: 100,
      renderCell: renderCell,
    },

    {
      field: "trimmed",
      type: "string",
      width: 170,
      editable: false,
      headerName: `${t("Category")}`,
    },
    {
      field: "value",
      type: "number",
      width: 100,
      editable: false,
      headerName: `${t("Area")} (m²)`,
    },
    {
      field: "length",
      type: "number",
      width: 100,
      editable: false,
      headerName: `${t("Length")} (m)`,
    },
    {
      field: "count",
      type: "number",
      width: 80,
      editable: false,
      headerName: `${t("Count")}`,
    },
  ];
  const dispatch = useDispatch();
  const [height, setHeight] = useState(260);
  const showTableMeasurings = useSelector(
    (state) => state.mapView.showTableMeasurings
  );

  const tableSummationData = useSelector(
    (state) => state.mapView.tableSummationData
  );

  const rows = tableSummationData.filter(
    (row) =>
      row.checked &&
      row?.value !== "0.00" &&
      row?.length !== "0.00" &&
      row?.count !== 0
  );

  console.log(rows, "rows");
  useEffect(() => {
    if (rows.length > 0) {
      if (rows.length < 4 || mode === "print") {
        const height = 52 * (rows.length + 1);
        setHeight(height);
      } else {
        setHeight(260);
      }
    }
  }, [rows, mode]);

  return (
    <>
      {showTableMeasurings && columns ? (
        <>
          <Box
            sx={{
              padding: 1,
              minHeight: "60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {showHeading ? (
              <Typography
                sx={{
                  padding: 0,
                  color: "#2B8AFF",
                  fontWeight: 600,
                  ml: `${marginLeftOfTitle}`,
                }}
              >
                {t("Table")} {t("Represents")} {t("Area")} in meter square(m²)
              </Typography>
            ) : null}

            {showCloseButton ? (
              <Tooltip placement="top-end" title={t("Close")}>
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
              </Tooltip>
            ) : null}
          </Box>
          <Box
            sx={{
              height: height,
              width: width,
              bottom: 5,
              right: 5,
              backgroundColor: "white",
            }}
          >
            <DataGrid
              hideFooter={true}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5]}
              // checkboxSelection={checkboxSelection}
              disableRowSelectionOnClick
              slots={{ noRowsOverlay: GridNoRowsOverlay }}
            />
          </Box>
        </>
      ) : null}
    </>
  );
}

// Path: src/components/TableMeasuringMapControl/TableMesuringsForMap.jsx

TableMeasuringsForMap.propTypes = {
  width: PropTypes.number,
  showCloseButton: PropTypes.bool,
  showHeading: PropTypes.bool,
  marginLeftOfTitle: PropTypes.number,
};
