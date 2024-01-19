import Appbar from '../components/Common/AppBar';
import InspectionForm from '../components/Inspection/InspectionForm';
import { Box } from '@mui/material';
import InspectionCard from '../components/Inspection/InspectionCard';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadInspectionForm from '../components/Inspection/UploadInspectionForm';

const Inspection = () => {
  const { client_id, project_id } = useParams();
  const InpectionData = useSelector((state) => state.inspection.inspectionData);
  const showUploadInspection = useSelector(
    (state) => state.displaySettings.showUploadInspection
  );
  console.log(
    '🚀 ~ showUploadInspection ~ showUploadInspection:',
    showUploadInspection
  );

  return (
    <div>
      <Appbar />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: "space-between",
        }}
      >
        <InspectionForm client_id={client_id} project_id={project_id} />
      </Box>
      {showUploadInspection && InpectionData
        ? InpectionData.map((inspection) => (
            <UploadInspectionForm key={inspection.id} inspection={inspection} />
          ))
        : null}
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
