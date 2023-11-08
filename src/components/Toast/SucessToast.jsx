import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SucessToast() {
  const [openRegisterSuccessToast, setOpenRegisterSuccessToast] =
    useState(true);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={openRegisterSuccessToast}
      autoHideDuration={6000}
      // onClose={handleClose}
      message="Sucessfully Created User"
      // action={action}
    >
      <Alert
        //  onClose={handleClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        Sucessfully Created User
      </Alert>
    </Snackbar>
  );
}
