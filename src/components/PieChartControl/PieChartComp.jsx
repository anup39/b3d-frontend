// import PieCharts from "./PieCharts";
import PieChartNew from "./PieChartNew";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { setshowPiechart } from "../../reducers/MapView";

export default function PieChartComp() {
  const dispatch = useDispatch();
  const showPiechart = useSelector((state) => state.mapView.showPiechart);

  return (
    <>
      {showPiechart ? (
        <>
          <Tooltip placement="top-end" title="Close Pie Chart">
            <HighlightOffIcon
              onClick={() => {
                dispatch(setshowPiechart(false));
              }}
              sx={{
                float: "right",
                color: "#E91E62",
                "&:hover": { cursor: "pointer" },
                mt: 0.5,
              }}
            />
          </Tooltip>
          <PieChartNew />
        </>
      ) : null}
    </>
  );
}
