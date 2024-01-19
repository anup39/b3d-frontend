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

const inspection_data_api = [
  {
    id: 1,
    name: "Inspection 1",
    totalPhoto: "112",
    inspectedPhoto: "21/112",
    date: "2022-05-19",
  },
  {
    id: 2,
    name: "Inspection 2",
    totalPhoto: "116",
    inspectedPhoto: "42/116",
    date: "2023-04-20",
  },
  {
    id: 3,
    name: "Inspection 3",
    TotalPhoto: "189",
    inspectedPhoto: "3/189",
    date: "2022-09-19",
  },
];

const Inspection = () => {
  const dispatch = useDispatch();
  const { client_id, project_id } = useParams();
  const inspection_data = useSelector(
    (state) => state.inspection.inspectionData
  );
  const showUploadInspection = useSelector(
    (state) => state.displaySettings.showUploadInspection
  );

  // When the component is mounted the data is set the store
  useEffect(() => {
    // later from api now it is hardcoded
    dispatch(setInspectionData(inspection_data_api));

    // When the component unmount the data is removed from the store
    return () => {
      dispatch(setInspectionData([]));
      dispatch(setshowUploadInspection(false));
    };
  }, [dispatch]);

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
              <InspectionCard key={inspection?.id} inspection={inspection} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Inspection;
