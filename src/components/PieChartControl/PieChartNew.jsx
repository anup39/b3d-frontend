import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";

const data = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];

export default function PieChartNew() {
  const data = useSelector((state) => state.mapView.tableSummationData);
  //   console.log(data, "data");

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
        },
      ]}
      width={400}
      height={200}
    />
  );
}
