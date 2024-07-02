import MeasuringUploadButton from "./MeasuringUploadButton";
import MeasuringUploadPanel from "./MeasuringUploadPanel";
import MeasuringUploadCancelButton from "./MeasuringUploadCancelButton";
import { useSelector } from "react-redux";
import { useGetMeasuringFileUploadQuery } from "../../api/measuringFileUpload";

export default function MeasuringUploadStatus() {
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.mapView.showMeasuringFileUploadPanel
  );

  const project_id = useSelector((state) => state.project.project_id);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);

  const { data: measuringsUploads } = useGetMeasuringFileUploadQuery(
    {
      project_id,
      client_id,
    },
    {
      skip: project_id === null,
      pollingInterval: 2000,
      skipPollingIfUnfocused: true,
    }
  );

  let measuringsUploadingCount = project_id ? measuringsUploads?.length : 0;

  return (
    <div>
      {showMeasuringFileUploadPanel ? (
        <div style={{ display: "flex" }}>
          <MeasuringUploadPanel measuringsUploads={measuringsUploads} />
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
