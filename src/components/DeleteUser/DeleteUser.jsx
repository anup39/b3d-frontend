import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setdeleteUserRoleId,
  setdeleteUserPopupMessage,
  setshowDeleteUserPopup,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";

export default function DeletePopup() {
  const dispatch = useDispatch();
  const showDeleteUserPopup = useSelector(
    (state) => state.displaySettings.showDeleteUserPopup
  );
  const deleteUserPopupMessage = useSelector(
    (state) => state.displaySettings.deleteUserPopupMessage
  );
  const deleteUserRoleId = useSelector(
    (state) => state.displaySettings.deleteUserRoleId
  );
  const [loading, setLoading] = useState(false);

  const handleDeleteUser = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .patch(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/${deleteTarget}/${deleteId}/`,
        {
          is_deleted: true,
        }
      )
      .then(() => {
        setLoading(false);
        dispatch(setshowDeleteUserPopup(false));
        dispatch(
          setdeleteUserPopupMessage(
            "Are you sure you want to delete this user?"
          )
        );
        dispatch(setdeleteUserRoleId(null));
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`Successfully Deleted  ${deleteUserRoleId}`));
        dispatch(settoastType("success"));
        window.location.reload(true);
      })
      .catch(() => {
        dispatch(setshowDeleteUserPopup(false));
        dispatch(
          setdeleteUserPopupMessage(
            "Are you sure you want to delete this user?"
          )
        );
        dispatch(setdeleteUserRoleId(null));
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`Failed To Delete  ${deleteUserRoleId}`));
        dispatch(settoastType("error"));
      });
  };

  return (
    <>
      {showDeleteUserPopup && (
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
            onSubmit={handleDeleteUser}
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
                <Typography variant="body2" color="text.secondary">
                  {deleteUserPopupMessage}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : `Delete`}
                  {loading ? <CircularProgress /> : null}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => {
                    dispatch(setshowDeleteUserPopup(false));
                  }}
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
      )}
    </>
  );
}
