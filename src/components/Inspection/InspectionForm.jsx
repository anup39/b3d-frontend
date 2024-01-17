import { Button, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { setshowTifUpload } from '../../reducers/DisplaySettings';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function InspectionForm() {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dispatch = useDispatch();
  const openForm = () => {
    dispatch(setshowTifUpload(true));
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
  };
  return (
    <>
      <Tooltip title='Add Inspection'>
        <Button
          onClick={openForm}
          sx={{ margin: '5px' }}
          variant='contained'
          color='error'
        >
          Add Inspection
        </Button>
      </Tooltip>
      {isFormOpen && (
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
            // onSubmit={handleCreateProject}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              background: '#fff',
              padding: '20px',
              zIndex: 10000,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id='name'
                  name='name'
                  label='Name'
                  variant='outlined'
                  size='small'
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Date'
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                    renderInput={() => (
                      <TextField
                        id='Date'
                        name='Date'
                        label='Date'
                        variant='outlined'
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add Inspection
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={closeForm}
                  variant='contained'
                  color='error'
                  size='small'
                  fullWidth
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
