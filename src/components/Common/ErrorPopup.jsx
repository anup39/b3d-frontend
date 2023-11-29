import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { setshowErrorPopup } from "../../reducers/DisplaySettings";
import { useSelector, useDispatch } from "react-redux";

export default function ErrorPopup() {
  const dispatch = useDispatch();
  const showErrorPopup = useSelector(
    (state) => state.displaySettings.showErrorPopup
  );
  const errorMessage = useSelector(
    (state) => state.displaySettings.errorMessage
  );

  const handleErrorDone = (e) => {
    e.preventDefault();
    dispatch(setshowErrorPopup(false));
    window.location.reload();
  };
  return (
    <>
      {showErrorPopup && (
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
            onSubmit={handleErrorDone}
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
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ color: "red" }}
                >
                  {errorMessage}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
