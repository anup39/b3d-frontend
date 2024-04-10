import MeasuringUploadButton from "./MeasuringUploadButton";
import MeasuringUploadPanel from "./MeasuringUploadPanel";
import MeasuringUploadCancelButton from "./MeasuringUploadCancelButton";
import { useSelector } from "react-redux";

export default function MeasuringUploadStatus() {
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.mapView.showMeasuringFileUploadPanel
  );
  const measuringsUploadingCount = useSelector(
    (state) => state.mapView.measuringsUploadingCount
  );

  return (
    <div>
      {showMeasuringFileUploadPanel ? (
        <div style={{ display: "flex" }}>
          <MeasuringUploadPanel />
          <MeasuringUploadCancelButton />
        </div>
      ) : (
        <MeasuringUploadButton
          measuringsUploadingCount={measuringsUploadingCount}
        />
      )}
    </div>
  );
}
