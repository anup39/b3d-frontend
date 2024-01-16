import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { setshowTifUpload } from '../../reducers/DisplaySettings';
import { useDispatch } from 'react-redux';

export default function AddPropertyButton() {
  const dispatch = useDispatch();
  const openForm = () => {
    dispatch(setshowTifUpload(true));
  };

  return (
    <>
      <Tooltip title='Create Property'>
        <Button
          onClick={openForm}
          sx={{ margin: '5px', position: 'static' }}
          variant='contained'
          color='error'
        >
          Add Property Map
        </Button>
      </Tooltip>
    </>
  );
}
