import { Button, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from '../../reducers/DisplaySettings';

export default function InspectionForm({ client_id, project_id }) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const openForm = () => {
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleCreateInspection = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    data.append('date', selectedDate);
    data.append('client', client_id);
    data.append('project', project_id);
    data.append('created_by', user_id);
    data.append('is_display', true);
    console.log(data, 'final paylaod');

    // #Todo
    setTimeout(() => {
      setLoading(false);
      // API call post request to send the data remaining
      // Loader and Toast Remaining
      dispatch(setshowToast(true));
      dispatch(settoastMessage('Successfully Created Inspection'));
      dispatch(settoastType('success'));
      closeForm();
    }, 5000);
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
            // zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleCreateInspection}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      onChange={(newValue) => setSelectedDate(newValue)}
                      label='Pick a date '
                    />
                  </DemoContainer>
                </LocalizationProvider>
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
InspectionForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
