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
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
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
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
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
