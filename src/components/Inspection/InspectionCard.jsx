import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FolderIcon from '@mui/icons-material/Folder';
import Typography from '@mui/material/Typography';

const InpectionData = [
  {
    id: 1,
    Name: 'Inspection 1',
    TotalPhoto: '112',
    InspectedPhoto: '21 / 112',
    Date: '2024 / 1 / 3',
  },
  {
    id: 2,
    Name: 'Inspection 2',
    TotalPhoto: '116',
    InspectedPhoto: '42 / 116',
    Date: '2024 / 2 / 8',
  },
  {
    id: 3,
    Name: 'Inspection 3',
    TotalPhoto: '189',
    InspectedPhoto: '3/189',
    Date: '2024 / 1 / 12',
  },
];

export default function InspectionCard() {
  return (
    <>
      {InpectionData.map((item) => (
        <div key={item.id}>
          <Paper
            sx={{
              p: 1,
              margin: 1,
              flexGrow: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
          >
            <Grid container spacing={2}>
              <Grid item>
                <FolderIcon
                  sx={{ width: 128, height: 128, color: '#65C9FF' }}
                />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction='column' spacing={2}>
                  <Grid item xs>
                    <Typography
                      gutterBottom
                      variant='subtitle1'
                      component='div'
                    >
                      {item.Name}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Typography variant='body2' color='text.secondary'>
                    Total Photos:{item.TotalPhoto}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Inspected Photos:{item.InspectedPhoto}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Date:{item.Date}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
      ))}
    </>
  );
}
