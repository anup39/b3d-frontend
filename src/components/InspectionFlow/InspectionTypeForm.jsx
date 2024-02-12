import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { setshowInspectionType } from '../../reducers/DisplaySettings';
import { useDispatch, useSelector } from 'react-redux';

const InspectionTypeForm = () => {
  const dispatch = useDispatch();
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
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
            width: '300px',
            background: '#fff',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 10000,
          }}
        >
          <Autocomplete
            sx={{ m: 0.5, width: '100%' }}
            multiple
            options={type_of_inspection.map((type) => type.standard_type)}
            getOptionLabel={(option) => option}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField {...params} label='Standard Type' variant='outlined' />
            )}
          />
          <Autocomplete
            sx={{ m: 0.5, width: '100%' }}
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
            sx={{ m: 0.5, width: '100%' }}
            options={type_of_inspection.map((type) => type.type)}
            getOptionLabel={(option) => option}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField {...params} label='Type' variant='outlined' />
            )}
          />
          <Grid
            item
            sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() => {
                dispatch(setshowInspectionType(false));
              }}
              variant='contained'
              size='small'
            >
              Cancel
            </Button>
            <Button
              //onClick={closeForm}
              variant='contained'
              color='error'
              size='small'
            >
              Save
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
};
export default InspectionTypeForm;
