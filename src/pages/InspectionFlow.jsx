import React from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Common/AppBar';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { Tooltip } from '@mui/material';

const InspectionFlow = () => {
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const { client_id, project_id, inspection_id } = useParams();

  return (
    <>
      <Appbar />
      <Grid container spacing={2} sx={{ margin: '4px' }}>
        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '180px' }}>
          <Typography>Lounkær Roof Inspection</Typography>
          <Grid>
            <Tooltip title='Draw'>
              <IconButton>
                <CropSquareIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Done'>
              <IconButton>
                <DoneIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton>
                <DeleteOutlineIcon sx={{ '&:hover': { cursor: 'pointer' } }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ margin: '4px' }}>
          <Grid item xs={12} md={8}>
            {/* Large Image */}
            <Box sx={{ height: '70%', backgroundColor: 'lightblue' }}>
              Large Image
            </Box>{' '}
            <Box
              sx={{ backgroundColor: 'pink', height: '30%', marginTop: '8px' }}
            >
              small Image
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                {/* image 3 */}
                <Box sx={{ height: '150px', backgroundColor: 'lightgreen' }}>
                  image 3
                </Box>
              </Grid>
              <Grid item>
                {/* image 4 */}
                <Box sx={{ height: '150px', backgroundColor: 'lightcoral' }}>
                  image 4
                </Box>
              </Grid>
              <Grid item>
                {/* Filter Section */}
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
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
                    sx={{ m: 1, width: '90%' }}
                    multiple
                    options={type_of_inspection.map(
                      (type) => type.standard_type
                    )}
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
                    sx={{ m: 1, width: '90%' }}
                    multiple
                    options={type_of_inspection.map((type) => type.sub_type)}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Sub Type'
                        variant='outlined'
                      />
                    )}
                  />

                  <Autocomplete
                    multiple
                    sx={{ m: 1, width: '90%' }}
                    options={type_of_inspection.map((type) => type.type)}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField {...params} label='Type' variant='outlined' />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  sx={{ margin: '4px' }}
                  variant='contained'
                  color='error'
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default InspectionFlow;
