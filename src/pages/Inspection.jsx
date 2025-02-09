import Appbar from "../components/Common/AppBar";
import InspectionForm from "../components/Inspection/InspectionForm";
import { Box } from "@mui/material";
import InspectionCard from "../components/Inspection/InspectionCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UploadInspectionForm from "../components/Inspection/UploadInspectionForm";
import { useEffect } from "react";
import { setInspectionData } from "../reducers/Inspection";
import { setshowUploadInspection } from "../reducers/DisplaySettings";
import axios from "axios";

const Inspection = () => {
  const dispatch = useDispatch();
  const { client_id, project_id } = useParams();
  const inspection_data = useSelector(
    (state) => state.inspection.inspectionData
  );

  const showUploadInspection = useSelector(
    (state) => state.displaySettings.showUploadInspection
  );

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-report/?project=${project_id}`
      )
      .then((res) => {
        dispatch(setInspectionData(res.data));
      });

    return () => {
      dispatch(setInspectionData([]));
      dispatch(setshowUploadInspection(false));
    };
  }, [dispatch, project_id]);

  return (
    <div>
      <Appbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        <InspectionForm client_id={client_id} project_id={project_id} />
      </Box>

      {showUploadInspection ? (
        <Box>
          <UploadInspectionForm client_id={client_id} project_id={project_id} />
        </Box>
      ) : null}
      <div>
        {inspection_data && inspection_data.length > 0
          ? inspection_data.map((inspection) => (
              <InspectionCard
                key={inspection?.id}
                inspection={inspection}
                client_id={client_id}
                project_id={project_id}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Inspection;
