import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Pentagon from "@mui/icons-material/Pentagon";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import GridNoRowsOverlay from "./Norows";
import { useTranslation } from "react-i18next";
import CustomToolbar from "./CustomToolbar/CustomToolbar";
import "./index.css";
import StandardCategory from "../../reducers/StandardCategory";

const capitalizeFirstLetter = (value) => {
  if (!value) return "";
  const newString = value.toString().trim();
  return newString.charAt(0).toUpperCase() + newString.slice(1);
};

const renderCell = (params) => {
  const { color, type_of_geometry } = params.value;
  const { subCategory, standardCategory, label } = params.row;
  let icon;
  if (
    label == capitalizeFirstLetter(subCategory) ||
    label == capitalizeFirstLetter(StandardCategory) ||
    label == `${capitalizeFirstLetter(subCategory)} Total`
  ) {
    return "";
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
      field: "label",
      type: "string",
      width: 150,
      editable: false,
      headerName: `${t("Label")}`,
    },
    {
      field: "trimmed",
      type: "string",
      width: 170,
      editable: false,
      headerName: `${t("Category")}`,
    },
    {
      field: "symbol",
      headerName: `${t("Symbol")}`,
      type: "string",
      width: 150,
      renderCell: renderCell,
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
      label: "",
      category: categories[2],
      subCategory: categories[1],
      standardCategory: categories[0],
    };
  });

  function getRowsWithSummedData() {
    let mainRow = [];
    let displayedStandardCategories = new Set();

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
      });
    });

    // Calculate total area / length
    Object.keys(groupedData).forEach((subCategory) => {
      let totalLength = 0;
      let totalArea = 0;
      let standardCategory = groupedData[subCategory][0].standardCategory;

      groupedData[subCategory].forEach((item) => {
        if (item.type_of_geometry === "LineString") {
          totalLength += parseFloat(item.length || 0);
        } else if (item.type_of_geometry === "Polygon") {
          totalArea += parseFloat(item.value || 0);
        }
      });

      // Insert a row for the standardCategory if not already inserted
      if (!displayedStandardCategories.has(standardCategory)) {
        displayedStandardCategories.add(standardCategory);
        mainRow.push({
          id: `standardCategory-${standardCategory}`,
          type_of_geometry: "-",
          view_name: "",
          name: `Standard Category: ${standardCategory}`,
          value: "",
          symbol: {
            color: "",
            type_of_geometry: "",
          },
          color: "",
          checked: true,
          length: "",
          trimmed: "",
          category: "",
          subCategory: standardCategory,
          standardCategory: standardCategory,
          label: capitalizeFirstLetter(standardCategory),
          colSpan: "2",
        });
      }

      // Empty row for SubCategory
      mainRow.push({
        id: `empty-row-${subCategory}`,
        type_of_geometry: "-",
        view_name: "",
        name: "",
        value: "",
        symbol: {
          color: "",
          type_of_geometry: "",
        },
        color: "",
        checked: true,
        length: "",
        trimmed: "",
        category: "",
        subCategory: subCategory,
        standardCategory: standardCategory,
        label: capitalizeFirstLetter(subCategory),
      });

      // Current row
      mainRow.push(...groupedData[subCategory]);

      // new row for sum of subCategory
      mainRow.push({
        id: `summary-${subCategory}`,
        type_of_geometry: "-",
        view_name: "",
        name: `Summary for ${subCategory}`,
        value: totalArea.toFixed(2) === "0.00" ? "" : totalArea.toFixed(2),
        symbol: { color: "", type_of_geometry: "" },
        color: "",
        checked: true,
        length: totalLength.toFixed(2) === "0.00" ? "" : totalLength.toFixed(2),
        trimmed: "",
        category: subCategory,
        subCategory: subCategory,
        standardCategory: standardCategory,
        label: `${capitalizeFirstLetter(subCategory)} Total`,
      });

      // empty row after subCategory name row
      mainRow.push({
        id: `empty-after-summary-${subCategory}`,
        type_of_geometry: "",
        view_name: "",
        name: "",
        value: "",
        symbol: { color: "", type_of_geometry: "" },
        color: "",
        checked: true,
        length: "",
        trimmed: "",
        category: "",
        subCategory: "",
        standardCategory: standardCategory,
        label: "",
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

  // for styling subCategory row adding classname to the dataGrid Row
  const getRowClassName = (params) => {
    const rowId = String(params.row.id);
    if (rowId.startsWith("empty-row-")) {
      return "subCategoryRow";
    }
    return "";
  };

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
              getRowClassName={(params) => getRowClassName(params)}
              hideFooter={true}
              rows={rowsWithSummedData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: rowsWithSummedData.length,
                  },
                },
              }}
              // pageSizeOptions={[5]}
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
  marginLeftOfTitle: PropTypes.string,
};
