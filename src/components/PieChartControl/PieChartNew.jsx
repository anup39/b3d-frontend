import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

export default function PieChartNew() {
  const data = useSelector((state) => state.mapView.tableSummationPieData);

  return (
    <Box flexGrow={2}>
      <Typography sx={{ padding: 0.5, color: "#2B8AFF", fontWeight: 600 }}>
        Piechart represents area in meter square(m²)
      </Typography>
      {data.length > 0 ? (
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
            },
          ]}
          width={400}
          height={190}
        />
      ) : (
        <Typography sx={{ ml: 15 }}>No data found</Typography>
      )}
    </Box>
  );
}
