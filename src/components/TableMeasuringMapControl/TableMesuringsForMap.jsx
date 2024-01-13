import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTableSummationData,
  setTableSummationDataColumns,
} from "../../reducers/MapView";
import PolylineIcon from "@mui/icons-material/Polyline";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { render } from "react-dom";

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  console.log(params, "params");
  let icon;

  if (type_of_geometry === "Polygon") {
    icon = <PolylineIcon sx={{ color: color }} />;
  } else if (type_of_geometry === "Point") {
    icon = <MyLocationIcon sx={{ color: color }} />;
  } else {
    icon = <ShowChartIcon sx={{ color: color }} />;
  }

  return icon;
};

const columns = [
  {
    field: "id",
    headerName: "id",
    width: 80,
    type: "string",
    editable: false,
  },
  {
    field: "symbol",
    headerName: "symbol",
    width: 150,
    type: "object",
    renderCell: renderCell,
  },

  {
    field: "standard_category",
    headerName: "standard_category",
    width: 150,
    type: "string",
    editable: false,
  },
  {
    field: "sub_category",
    type: "string",
    width: 150,
    editable: false,
    headerName: "sub_category",
  },
  {
    field: "category",
    type: "string",
    width: 150,
    editable: false,
    headerName: "category",
  },
  {
    field: "type_of_geometry",
    type: "string",
    width: 150,
    editable: false,
    headerName: "type_of_geometry",
  },
  {
    field: "description",
    type: "string",
    width: 150,
    editable: false,
    headerName: "description",
  },
  {
    field: "area",
    type: "string",
    width: 150,
    editable: false,
    headerName: "area",
  },
  {
    field: "length",
    type: "string",
    width: 150,
    editable: false,
    headerName: "length",
  },
];

const rows = [
  {
    id: 1,
    standard_category: "Grass",
    sub_category: "Grass Green",
    category: "Grass Green Tall",
    type_of_geometry: "Polygon",
    description: "Grass measurings",
    area: 45,
    length: 56,
    symbol: { color: "red", type_of_geometry: "Polygon" },
  },
  {
    id: 2,
    standard_category: "Grass",
    sub_category: "Grass Green",
    category: "Grass Green Short",
    type_of_geometry: "Polygon",
    description: "Grass measurings",
    area: 45,
    length: 56,
    symbol: { color: "red", type_of_geometry: "Polygon" },
  },
  {
    id: 3,
    standard_category: "Lake",
    sub_category: "Lake Depth",
    category: "Lake Depth Old",
    type_of_geometry: "LineString",
    description: "Lake measurings",
    area: 40,
    length: 560,
    symbol: { color: "green", type_of_geometry: "LineString" },
  },
  {
    id: 4,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Rural",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: 450,
    length: 560,
    symbol: { color: "blue", type_of_geometry: "Point" },
  },
  {
    id: 5,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: 450,
    length: 560,
    symbol: { color: "blue", type_of_geometry: "Point" },
  },
  {
    id: 6,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: 450,
    length: 560,
    symbol: { color: "yellow", type_of_geometry: "Point" },
  },
  {
    id: 7,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: 450,
    length: 560,
    symbol: "red",
  },
];

export default function TableMeasuringsForMap() {
  const dispatch = useDispatch();
  const showTableMeasurings = useSelector(
    (state) => state.mapView.showTableMeasurings
  );

  const currentClient = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );
  const currentProject = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );

  // const columns = useSelector(
  //   (state) => state.mapView.tableSummationDataColumns
  // );

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/measuring-table-summation/?client=${currentClient}&project=${currentProject}`
      )
      .then((res) => {
        if (showTableMeasurings && res.data.columns.length > 0) {
          // dispatch(setTableSummationData(res.data));
          dispatch(setTableSummationDataColumns(res.data.columns));

          console.log(res.data.columns);
        } else {
          dispatch(setTableSummationDataColumns([]));
        }
      });
  }, [showTableMeasurings, currentClient, currentProject, dispatch]);
  return (
    <>
      {showTableMeasurings && columns ? (
        <Box
          sx={{
            height: 300,
            width: 700,
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
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      ) : null}
    </>
  );
}
