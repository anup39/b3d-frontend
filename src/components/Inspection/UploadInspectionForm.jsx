import { useState } from "react";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "./Dropzone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormControlLabel from "@mui/material/FormControlLabel";
import { setTypeofInspectionChecked } from "../../reducers/InspectionUpload";
import PropTypes from "prop-types";
import dayjs from "dayjs";

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

  const handleChangeType = (event, type) => {
    const id = type.id;
    dispatch(
      setTypeofInspectionChecked({ id: id, checked: event.target.checked })
    );
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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          // zIndex: 9999,
        }}
      >
        <form
          onSubmit={handleUploadPhotos}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            background: "#fff",
            padding: "20px",
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
                      variant="subtitle1"
                      component="div"
                    >
                      Name: {inspection?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          defaultValue={dayjs(inspection?.date)}
                          onChange={(newValue) => setSelectedDate(newValue)}
                          label="Pick a date "
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        flexGrow: 1,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                        height: "300px",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography
                            sx={{
                              marginLeft: 2,
                              marginTop: 1,
                            }}
                            variant="body2"
                            gutterBottom
                          >
                            Type of Inspection
                          </Typography>
                        </Grid>
                        <Grid container>
                          <Grid item>
                            {type_of_inspection.map((type) => (
                              <FormControlLabel
                                sx={{ marginLeft: 1 }}
                                key={type.id}
                                slotProps={{
                                  typography: {
                                    fontSize: 12,
                                    color: "#6A6D70",
                                    fontWeight: 900,
                                  },
                                }}
                                label={type?.full_type}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={type?.checked}
                                    // indeterminate={type?.indeterminate}
                                    onChange={(event) =>
                                      handleChangeType(event, type)
                                    }
                                  />
                                }
                              />
                            ))}
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
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
            >
              <Box>
                <Box sx={{ height: "400px" }}>
                  <Typography sx={{ marginLeft: 1 }}>Files</Typography>
                </Box>
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

UploadInspectionForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
