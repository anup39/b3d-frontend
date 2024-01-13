import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTableSummationData,
  setTableSummationDataColumns,
} from "../../reducers/MapView";

const rows = [
  {
    id: 1,
    standard_category: "Grass",
    sub_category: "Grass Green",
    category: "Grass Green Tall",
    type_of_geometry: "Polygon",
    description: "Grass measurings",
    area: "45 sq",
    length: "56 miles",
    symbol: "red",
  },
  {
    id: 2,
    standard_category: "Grass",
    sub_category: "Grass Green",
    category: "Grass Green Short",
    type_of_geometry: "Polygon",
    description: "Grass measurings",
    area: "45 sq",
    length: "56 miles",
    symbol: "red",
  },
  {
    id: 3,
    standard_category: "Lake",
    sub_category: "Lake Depth",
    category: "Lake Depth Old",
    type_of_geometry: "LineString",
    description: "Lake measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 4,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Rural",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 5,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 6,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 7,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 8,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 9,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
  },
  {
    id: 10,
    standard_category: "Pole",
    sub_category: "Pole Electrical",
    category: "Pole Electrical Residental",
    type_of_geometry: "Point",
    description: "Pole measurings",
    area: "450 sq",
    length: "560 miles",
    symbol: "green",
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

  const columns = useSelector(
    (state) => state.mapView.tableSummationDataColumns
  );

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
