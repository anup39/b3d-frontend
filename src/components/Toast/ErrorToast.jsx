import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ErrorToast() {
  const [openRegisterErrorToast, setOpenRegisterErrorToast] = useState(false);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={openRegisterErrorToast}
      autoHideDuration={6000}
      // onClose={handleClose}
      message="Failed to Create User"
      // action={action}
    >
      <Alert
        //  onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
      >
        Failed to Create User
      </Alert>
    </Snackbar>
  );
}
