import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Common/AppBar';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { Tooltip } from 'recharts';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CropSquareIcon from '@mui/icons-material/CropSquare';

const InspectionFlow = () => {
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const { client_id, project_id, inspection_id } = useParams();

  return (
    <>
      <Appbar />
      <Grid container spacing={2} sx={{ margin: '4px' }}>
        <Grid item>
          <Grid item>
            <Typography>Lounkær Roof Inspection</Typography>
            <Grid>
              <Tooltip title='Draw'>
                <CropSquareIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </Tooltip>
              <Tooltip title='Done'>
                <DoneIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </Tooltip>
              <Tooltip title='Delete'>
                <DeleteOutlineIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </Tooltip>
            </Grid>
          </Grid>

          <Box>Large Image</Box>
          <Grid item container>
            small images
          </Grid>
        </Grid>
        <Grid item>
          <Box>image 3</Box>
          <Box>image 4</Box>
          <Grid
            item
            container
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography
              sx={{
                marginLeft: 1,
                marginTop: 2,
                color: '#ED1C24',
              }}
              variant='body2'
              gutterBottom
            >
              Filter
            </Typography>

            <Autocomplete
              sx={{ m: 1, width: 350 }}
              multiple
              options={type_of_inspection.map((type) => type.standard_type)}
              getOptionLabel={(option) => option}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Standard Type'
                  variant='outlined'
                />
              )}
            />

            <Autocomplete
              sx={{ m: 1, width: 350 }}
              multiple
              options={type_of_inspection.map((type) => type.sub_type)}
              getOptionLabel={(option) => option}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField {...params} label='Sub Type' variant='outlined' />
              )}
            />

            <Autocomplete
              multiple
              sx={{ m: 1, width: 350 }}
              options={type_of_inspection.map((type) => type.type)}
              getOptionLabel={(option) => option}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField {...params} label='Type' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button sx={{ margin: '4px' }} variant='contained' color='error'>
              Report
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default InspectionFlow;
