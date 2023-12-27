import PieCharts from "./PieCharts";
import { useSelector } from "react-redux";

export default function PieChartComp() {
  const showPiechart = useSelector((state) => state.mapView.showPiechart);
  return <>{showPiechart ? <PieCharts></PieCharts> : null}</>;
}
