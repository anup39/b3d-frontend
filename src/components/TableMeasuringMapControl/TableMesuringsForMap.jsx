import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTableSummationData,
  setTableSummationDataColumns,
} from "../../reducers/MapView";
import RectangleIcon from "@mui/icons-material/Rectangle";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { render } from "react-dom";

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  console.log(params, "params");
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
    width: 140,
    editable: false,
    headerName: "description",
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
    width: 90,
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
        // if (showTableMeasurings && res.data.columns.length > 0) {
        //   // dispatch(setTableSummationData(res.data));
        //   // dispatch(setTableSummationDataColumns(res.data.columns));
        //   console.log(res.data.columns);
        // } else {
        //   dispatch(setTableSummationDataColumns([]));
        // }
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
