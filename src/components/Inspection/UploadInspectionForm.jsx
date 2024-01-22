import { useState } from 'react';
import { Box, Button, Checkbox, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import Dropzone from './Dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  setFiles,
  setFilesChecked,
  setTypeofInspectionChecked,
} from '../../reducers/InspectionUpload';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { setshowUploadInspection } from '../../reducers/DisplaySettings';

const UploadInspectionForm = ({ client_id, project_id }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const inspection_id = useSelector(
    (state) => state.inspectionUpload.inspection_id
  );
  const inspection = useSelector(
    (state) => state.inspection.inspectionData
  ).filter((inspection) => inspection.id === inspection_id)[0];

  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );

  const files = useSelector((state) => state.inspectionUpload.files);
  console.log('🚀 ~ UploadInspectionForm ~ files:', files);

  const handleChangeType = (event, type) => {
    const id = type.id;
    dispatch(
      setTypeofInspectionChecked({ id: id, checked: event.target.checked })
    );
  };
  const handleChangePhoto = (event, file) => {
    const id = file.id;
    dispatch(setFilesChecked({ id: id, checked: event.target.checked }));
  };

  const handleUploadPhotos = (event) => {
    event.preventDefault();
    console.log(selectedDate);
    console.log(client_id, project_id);
  };
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          overflow: 'auto',
          zIndex: 9999,
        }}
      >
        <form
          onSubmit={handleUploadPhotos}
          style={{
            width: '100%',
            maxWidth: '800px',
            background: '#fff',
            padding: '20px',
            zIndex: 10000,
            margin: '80px auto',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography
                        gutterBottom
                        variant='subtitle1'
                        component='div'
                      >
                        Name: {inspection?.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            defaultValue={dayjs(inspection?.date)}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            label='Pick a date '
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Paper
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                        width: '100%',
                        height: '200px',
                        margin: '10px',
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography
                            sx={{
                              marginLeft: 2,
                              marginTop: 1,
                            }}
                            variant='body2'
                            gutterBottom
                          >
                            Type of Inspection
                          </Typography>
                        </Grid>
                        <Grid item>
                          {type_of_inspection.map((type) => (
                            <FormControlLabel
                              sx={{ marginLeft: 1 }}
                              key={type.id}
                              slotProps={{
                                typography: {
                                  fontSize: 12,
                                  color: '#6A6D70',
                                  fontWeight: 900,
                                },
                              }}
                              label={type?.full_type}
                              control={
                                <Checkbox
                                  size='small'
                                  checked={type?.checked}
                                  onChange={(event) =>
                                    handleChangeType(event, type)
                                  }
                                />
                              }
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Box>
                    <Box sx={{ height: '300px' }}>Map placement </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Paper
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                height: '350px',
              }}
            >
              <Box
                sx={{
                  width: '200px',
                  overflow: 'scroll',
                  flex: '1',
                }}
              >
                <Typography
                  sx={{
                    marginLeft: 2,
                    marginTop: 2,
                  }}
                  variant='body2'
                  gutterBottom
                >
                  Total Photos: {inspection?.totalPhoto}
                </Typography>
                <Grid container>
                  <Grid item>
                    {files.map((file) => (
                      <FormControlLabel
                        sx={{ marginLeft: 1 }}
                        key={file.id}
                        slotProps={{
                          typography: {
                            fontSize: 12,
                            color: '#6A6D70',
                            fontWeight: 600,
                          },
                        }}
                        label={file?.fileName}
                        control={
                          <Checkbox
                            size='small'
                            checked={file?.checked}
                            onChange={(event) => handleChangePhoto(event, file)}
                          />
                        }
                      />
                    ))}
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                {files.map((file) => (
                  <Dropzone key={file?.id} file={file} />
                ))}
              </Box>
            </Paper>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'center' },
              alignItems: 'center',
              marginTop: { xs: '10px', md: '10px' },
            }}
          >
            <Button sx={{ margin: '5px' }} variant='contained' color='primary'>
              Upload Photos
            </Button>
            <Button
              onClick={() => {
                dispatch(setshowUploadInspection(false));
              }}
              sx={{ margin: '5px' }}
              variant='contained'
              color='primary'
            >
              Cancel
            </Button>
          </Box>
          {/* ... (existing code) */}
        </form>
      </div>
    </>
  );
};

export default UploadInspectionForm;

UploadInspectionForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
