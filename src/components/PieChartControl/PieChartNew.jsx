import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { bool } from "prop-types";

export default function PieChartNew({ showHeading }) {
  const { t } = useTranslation();
  const data_reducer = useSelector(
    (state) => state.mapView.tableSummationPieData
  );

  const data = data_reducer.filter((row) => row.checked);
  console.log(data, "rows from pie");

  return (
    <Box flexGrow={2}>
      {showHeading ? (
        <Typography sx={{ padding: 0.5, color: "#2B8AFF", fontWeight: 600 }}>
          {t("Piechart")} {t("Represents")} {t("Area")} in meter square(m²)
        </Typography>
      ) : null}

      {data.length > 0 ? (
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
            },
          ]}
          slotProps={{
            legend: { hidden: true },
          }}
          width={400}
          height={190}
        />
      ) : (
        <>
          {showHeading ? (
            <Typography sx={{ ml: 10, mr: 10, fontSize: 12, p: 2 }}>
              {t("No") + " " + t("Data") + " " + t("Available")}
            </Typography>
          ) : null}
        </>
      )}
    </Box>
  );
}

PieChartNew.propTypes = {
  showHeading: bool,
};
