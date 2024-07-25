import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Pentagon from "@mui/icons-material/Pentagon";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import GridNoRowsOverlay from "./Norows";
import { useTranslation } from "react-i18next";
import CustomToolbar from "./CustomToolbar/CustomToolbar";
import AddIcon from "@mui/icons-material/Add";

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  let icon;
  if (type_of_geometry.startsWith("Total")) {
    icon = <AddIcon sx={{ color: color }} />;
    return icon;
  }
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

  // Adding category, subCategory, StandardCategory keys seperately to the current row
  const subCategoriesArray = [];
  const newDataWithSubCategory = rows.map((item) => {
    const categories = item.view_name.split("|");
    if (!subCategoriesArray.includes(categories[1])) {
      subCategoriesArray.push(categories[1]);
    }
    return {
      ...item,
      category: categories[2],
      subCategory: categories[1],
      standardCategory: categories[0],
    };
  });

  function getRowsWithSummedData() {
    let mainRow = [];

    // items grouped with subCategory
    let groupedData = {};
    newDataWithSubCategory.forEach((item) => {
      let subCategory = item.subCategory;
      if (!groupedData[subCategory]) {
        groupedData[subCategory] = [];
      }
      groupedData[subCategory].push({
        ...item,
        trimmed: item.category,
        count: "",
      });
    });

    // Calculate total area / length
    Object.keys(groupedData).forEach((subCategory) => {
      let totalLength = 0;
      let totalArea = 0;

      groupedData[subCategory].forEach((item) => {
        if (item.type_of_geometry === "LineString") {
          totalLength += parseFloat(item.length || 0);
        } else if (item.type_of_geometry === "Polygon") {
          totalArea += parseFloat(item.value || 0);
        }
      });

      // Insert the current row
      mainRow.push(...groupedData[subCategory]);

      //Insert new row which includes sum of a subCategory
      mainRow.push({
        id: `summary-${subCategory}`,
        type_of_geometry: "-",
        view_name: "",
        description: `Summary for ${subCategory}`,
        name: `Summary for ${subCategory}`,
        value: totalArea.toFixed(2) == 0 ? "" : totalArea.toFixed(2),
        symbol: { color: "#ffffff", type_of_geometry: `Total` },
        color: "#ffffff",
        checked: true,
        length: totalLength.toFixed(2) == 0 ? "" : totalLength.toFixed(2),
        count: groupedData[subCategory].length,
        trimmed: "Total",
        category: subCategory,
        subCategory: subCategory,
        standardCategory: groupedData[subCategory][0].standardCategory,
      });
    });
    return mainRow;
  }

  const rowsWithSummedData = getRowsWithSummedData();

  useEffect(() => {
    if (rowsWithSummedData.length > 0) {
      if (rowsWithSummedData.length < 4 || mode === "print") {
        const height = 53 * (rowsWithSummedData.length + 1);
        setHeight(height);
      } else {
        setHeight(260);
      }
    }
  }, [rowsWithSummedData, mode]);

  return (
    <>
      {showTableMeasurings && columns ? (
        <>
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
              rows={rowsWithSummedData}
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
              slots={{
                noRowsOverlay: GridNoRowsOverlay,
                toolbar: showHeading
                  ? () => <CustomToolbar showCloseButton={showCloseButton} />
                  : null,
              }}
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
