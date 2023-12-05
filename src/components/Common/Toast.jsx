import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setshowToast } from "../../reducers/DisplaySettings";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast() {
  const dispatch = useDispatch();
  const showToast = useSelector((state) => state.displaySettings.showToast);
  const toastMessage = useSelector(
    (state) => state.displaySettings.toastMessage
  );
  const toastType = useSelector((state) => state.displaySettings.toastType);

  const handleToastClose = () => {
    dispatch(setshowToast(false));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={showToast}
      autoHideDuration={5000}
      onClose={handleToastClose}
    >
      <Alert severity={toastType} sx={{ width: "100%" }}>
        {toastMessage}
      </Alert>
    </Snackbar>
  );
}
