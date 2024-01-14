import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import RectangleIcon from "@mui/icons-material/Rectangle";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  let icon;
  if (type_of_geometry === "Polygon") {
    icon = <RectangleIcon sx={{ color: color }} />;
  } else if (type_of_geometry === "Point") {
    icon = <CircleIcon sx={{ color: color }} />;
  } else {
    icon = <ShowChartIcon sx={{ color: color }} />;
  }

  return icon;
};

const columns = [
  // {
  //   field: "id",
  //   headerName: "id",
  //   width: 80,
  //   type: "number",
  //   editable: false,
  // },
  {
    field: "symbol",
    headerName: "symbol",
    type: "string",
    width: 80,
    renderCell: renderCell,
  },
  {
    field: "view_name",
    headerName: "category",
    type: "string",
    width: 290,
  },
  {
    field: "description",
    type: "string",
    width: 170,
    editable: false,
    headerName: "description",
  },
  {
    field: "count",
    type: "number",
    width: 100,
    editable: false,
    headerName: "count",
  },
  {
    field: "area",
    type: "number",
    width: 50,
    editable: false,
    headerName: "area",
  },
  {
    field: "length",
    type: "number",
    width: 130,
    editable: false,
    headerName: "length",
  },
];

const rows = [
  {
    id: 1,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 45,
    length: 56,
    symbol: { color: "red", type_of_geometry: "Polygon" },
  },
  {
    id: 2,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 45,
    length: 56,
    symbol: { color: "red", type_of_geometry: "Polygon" },
  },
  {
    id: 3,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 40,
    length: 560,
    symbol: { color: "green", type_of_geometry: "LineString" },
  },
  {
    id: 4,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 450,
    length: 560,
    symbol: { color: "blue", type_of_geometry: "Point" },
  },
  {
    id: 5,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 450,
    length: 560,
    symbol: { color: "blue", type_of_geometry: "Point" },
  },
  {
    id: 6,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 450,
    length: 560,
    symbol: { color: "yellow", type_of_geometry: "Point" },
  },
  {
    id: 7,
    view_name: "Grass Green Short",
    description: "Grass measurings",
    area: 450,
    length: 560,
    symbol: "red",
  },
];

export default function TableMeasuringsForMap({ width, checkboxSelection }) {
  const showTableMeasurings = useSelector(
    (state) => state.mapView.showTableMeasurings
  );

  const rows = useSelector((state) => state.mapView.tableSummationData);

  return (
    <>
      {showTableMeasurings && columns ? (
        <Box
          sx={{
            height: 260,
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
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick
          />
        </Box>
      ) : null}
    </>
  );
}
