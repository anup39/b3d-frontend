import React from 'react';
import Appbar from '../components/Common/AppBar';
import InspectionForm from '../components/Inspection/InspectionForm';
import { Box } from '@mui/material';

const Inspection = () => {
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
        <InspectionForm />
      </Box>
    </div>
  );
};

export default Inspection;
