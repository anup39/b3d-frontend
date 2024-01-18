import Appbar from "../components/Common/AppBar";
import InspectionForm from "../components/Inspection/InspectionForm";
import { Box } from "@mui/material";
import InspectionCard from "../components/Inspection/InspectionCard";
import { useParams } from "react-router-dom";

const InpectionData = [
  {
    id: 1,
    name: "Inspection 1",
    totalPhoto: "112",
    inspectedPhoto: "21/112",
    date: "2024/1/3",
  },
  {
    id: 2,
    name: "Inspection 2",
    totalPhoto: "116",
    inspectedPhoto: "42/116",
    Date: "2024/2/8",
  },
  {
    id: 3,
    name: "Inspection 3",
    TotalPhoto: "189",
    InspectedPhoto: "3/189",
    Date: "2024/1/12",
  },
];

const Inspection = () => {
  const { client_id, project_id } = useParams();
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
      <div>
        {InpectionData
          ? InpectionData.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Inspection;
