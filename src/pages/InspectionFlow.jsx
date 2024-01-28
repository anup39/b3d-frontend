import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Common/AppBar';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { Tooltip } from '@mui/material';
import img1 from '/Inspire2/DJI_0015_6_7.jpg';
import img2 from '/Inspire2/DJI_0024_5_6.jpg';
import img3 from '/Inspire2/DJI_0042_3_4.jpg';
import img4 from '/Inspire2/DJI_0066_7_8.jpg';
import ImageCarousel from '../components/Common/ImageCarousel';

const itemData = [
  { img: img1, title: 'Image 1' },
  { img: img2, title: 'Image 2' },
  { img: img3, title: 'Image 3' },
  { img: img4, title: 'Image 4' },
];

const InspectionFlow = () => {
  const [selectedImage, setSelectedImage] = useState(itemData[0].img);

  const handleSmallImageClick = (img) => {
    setSelectedImage(img);
  };
  const type_of_inspection = useSelector(
    (state) => state.inspectionUpload.type_of_inspection
  );
  const { client_id, project_id, inspection_id } = useParams();

  return (
    <>
      <Appbar />
      <div
        style={{
          margin: '20px',
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Grid item>
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                Lounkær Roof Inspection
              </Typography>
            </Grid>
            <Grid item>
              <Grid sx={{ whiteSpace: 'nowrap' }}>
                <Tooltip title='Draw'>
                  <IconButton>
                    <CropSquareIcon
                      sx={{ '&:hover': { cursor: 'pointer' }, color: 'red' }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Done'>
                  <IconButton>
                    <DoneIcon
                      sx={{ '&:hover': { cursor: 'pointer' }, color: 'red' }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton>
                    <DeleteOutlineIcon
                      sx={{ '&:hover': { cursor: 'pointer' }, color: 'red' }}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ margin: '4px' }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: '70%', backgroundColor: 'pink' }}>
                <img
                  src={selectedImage}
                  alt={selectedImage}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Box
                sx={{
                  backgroundColor: '#F1F7FF',
                  height: '25%',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <Grid
                  item
                  sx={{
                    transform: 'scale(0.9)',
                  }}
                >
                  <Box>
                    <ImageCarousel
                      itemData={itemData}
                      onImageClick={handleSmallImageClick}
                    />
                  </Box>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid
                container
                direction={{ xs: 'row', md: 'column' }}
                spacing={2}
              >
                <Grid item xs={6} md={12}>
                  <Box
                    sx={{
                      height: '200px',
                      backgroundColor: 'lightgreen',
                      width: '100%',
                    }}
                  >
                    <img
                      src={img3}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={12}>
                  <Box
                    sx={{
                      height: '200px',
                      backgroundColor: 'lightcoral',
                      width: '100%',
                    }}
                  >
                    <img
                      src={img2}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container direction='column' spacing={2}>
                <Grid item>
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
                        marginTop: 1,
                        color: '#ED1C24',
                      }}
                      variant='body2'
                      gutterBottom
                    >
                      Filter
                    </Typography>

                    <Autocomplete
                      sx={{ m: 0.5, width: '100%' }}
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
                      sx={{ m: 0.5, width: '100%' }}
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
                      sx={{ m: 0.5, width: '100%' }}
                      options={type_of_inspection.map((type) => type.type)}
                      getOptionLabel={(option) => option}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Type'
                          variant='outlined'
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant='contained' color='error'>
                    Report
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default InspectionFlow;
