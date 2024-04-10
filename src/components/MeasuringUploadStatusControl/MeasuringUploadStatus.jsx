import MeasuringUploadButton from "./MeasuringUploadButton";
import MeasuringUploadPanel from "./MeasuringUploadPanel";
import MeasuringUploadCancelButton from "./MeasuringUploadCancelButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchMeasuringsUploadStatus } from "../../api/api";
import { setMeasuringsUploadingCount } from "../../reducers/MapView";

export default function MeasuringUploadStatus() {
  const dispatch = useDispatch();
  const [measuringsUploads, setMeasuringsUploads] = useState([]);
  const showMeasuringFileUploadPanel = useSelector(
    (state) => state.mapView.showMeasuringFileUploadPanel
  );
  const measuringsUploadingCount = useSelector(
    (state) => state.mapView.measuringsUploadingCount
  );

  const project_id = useSelector((state) => state.project.project_id);
  const client_id = useSelector((state) => state.client.clientDetail.client_id);

  console.log(project_id, client_id);

  useEffect(() => {
    if (client_id && project_id) {
      const fetchData = () => {
        fetchMeasuringsUploadStatus({ project_id, client_id }).then((res) => {
          const measuringsUploads = res;
          const measuringsUploadsCount = measuringsUploads.filter(
            (measuring) => measuring.status === "Uploading"
          ).length;
          dispatch(setMeasuringsUploadingCount(measuringsUploadsCount));
          setMeasuringsUploads(measuringsUploads);
        });
      };

      const interval = setInterval(fetchData, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [client_id, project_id, dispatch]);

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
