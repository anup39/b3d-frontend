import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setshowToast } from "../../reducers/DisplaySettings";
import PropTypes from "prop-types";

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

  const vertical = "top";
  const horizontal = "center";

  return (
    <Snackbar
      anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
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

// Path: src/components/Common/Loader.jsx
Toast.propTypes = {
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
};
