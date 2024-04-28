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

const columns = [
  {
    field: "symbol",
    headerName: "Symbol",
    type: "string",
    width: 100,
    renderCell: renderCell,
  },

  {
    field: "view_name",
    type: "string",
    width: 100,
    editable: false,
    headerName: "Category",
  },
  {
    field: "value",
    type: "number",
    width: 100,
    editable: false,
    headerName: "Area (m²)",
  },
  {
    field: "length",
    type: "number",
    width: 100,
    editable: false,
    headerName: "Length (m)",
  },
  {
    field: "count",
    type: "number",
    width: 100,
    editable: false,
    headerName: "Count",
  },
];

export default function TableMeasuringsForMap({
  width,
  showCloseButton,
  marginLeftOfTitle,
  mode,
}) {
  const [height, setHeight] = useState(260);
  const dispatch = useDispatch();
  const showTableMeasurings = useSelector(
    (state) => state.mapView.showTableMeasurings
  );

  const rows = useSelector((state) => state.mapView.tableSummationData);
  console.log("rows", rows);
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
            <Typography
              sx={{
                padding: 0,
                color: "#2B8AFF",
                fontWeight: 600,
                ml: `${marginLeftOfTitle}`,
              }}
            >
              Table represents area in meter square(m²)
            </Typography>

            {showCloseButton ? (
              <Tooltip placement="top-end" title="Close Pie Chart">
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
  marginLeftOfTitle: PropTypes.number,
};
