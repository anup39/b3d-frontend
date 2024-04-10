import MeasuringUploadButton from "./MeasuringUploadButton";
import MeasuringUploadPanel from "./MeasuringUploadPanel";
import { useSelector } from "react-redux";

export default function MeasuringUploadStatus() {
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.mapView.showMeasuringFileUploadPanel
  );

  return (
    <div>
      {showMeasuringFileUploadPanel ? (
        <MeasuringUploadPanel />
      ) : (
        <MeasuringUploadButton />
      )}
    </div>
  );
}
