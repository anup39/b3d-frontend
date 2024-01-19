import React, { useState } from 'react';
import { Box, Button, Checkbox, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import Dropzone from './Dropzone';

const UploadInspectionForm = ({ inspection }) => {
  const [checked, setChecked] = useState(true);

  const InspectionUpload = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const { name, date } = inspection;
  console.log('🚀 ~ UploadInspectionForm ~ inspection:', inspection);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <form
          // onSubmit={handleCreateInspection}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            background: '#fff',
            padding: '20px',
            zIndex: 10000,
          }}
        >
          <Grid container>
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item container xs={5} spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      gutterBottom
                      variant='subtitle1'
                      component='div'
                    >
                      Name: {name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      gutterBottom
                      variant='subtitle1'
                      component='div'
                    >
                      Date: {date}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        flexGrow: 1,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                        height: '300px',
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant='body2' gutterBottom>
                            Type of Inspection
                          </Typography>
                        </Grid>
                        <Grid container>
                          <Grid item>
                            <Checkbox
                              checked={checked}
                              onChange={handleChange}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <Grid item>
                              <Typography variant='body2' gutterBottom>
                                Roof
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid item container xs={7}>
                  <Box>Map placement </Box>
                </Grid>
              </Grid>
            </Grid>
            <Paper
              sx={{
                flexGrow: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
              }}
            >
              <Box>
                <Dropzone />
              </Box>
            </Paper>
          </Grid>

          {/*
            <Grid item spacing={3}>
              <Grid item>1</Grid>
              <Box
                sx={{
                  width: '250px',
                  height: '250px',
                }}
              >
                2
              </Box>
              <Grid item>3</Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                fullWidth
                variant={loading ? 'outlined' : 'contained'}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? null : 'Add Inspection'}
                {loading ? <CircularProgress /> : null}
              </Button>
            </Grid> */}
          {/* <Grid item xs={12}>
              <Button
                onClick={closeForm}
                variant='contained'
                color='error'
                size='small'
                fullWidth
              >
                Close
              </Button>
            </Grid> */}
        </form>
      </div>
    </>
  );
};

export default UploadInspectionForm;
