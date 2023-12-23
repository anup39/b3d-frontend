import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

export default function UploadingCategories() {
  //   const [isFormOpen, setIsFormOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  //   const openForm = () => {
  //     setIsFormOpen(true);
  //   };

  const closeForm = () => {
    setLoaded(false);
  };

  const handleCreateProperty = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  return (
    <>
      {/* {isFormOpen && ( */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <form
          onSubmit={handleCreateProperty}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Measuring for: Map Nov</Typography>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant={loading ? "outlined" : "contained"}
                sx={{ mt: 0, mb: 0 }}
                disabled={!loaded}
              >
                {loading ? null : "Add Property Map"}
                {loading ? <CircularProgress /> : null}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={closeForm}
                variant="contained"
                color="error"
                size="small"
                fullWidth
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* )} */}
    </>
  );
}

UploadingCategories.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
  onProgressForm: PropTypes.func,
  onProgressValue: PropTypes.func,
  onSetRasters: PropTypes.func,
};
