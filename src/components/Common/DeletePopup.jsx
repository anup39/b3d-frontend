import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeletePopup,
  setshowToast,
  settoastMessage,
  settoastType,
  setshowDeleteLoader,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";

export default function DeletePopup() {
  const dispatch = useDispatch();
  const showDeletePopup = useSelector(
    (state) => state.displaySettings.showDeletePopup
  );
  const deletePopupMessage = useSelector(
    (state) => state.displaySettings.deletePopupMessage
  );
  const deleteId = useSelector((state) => state.displaySettings.deleteId);
  const deleteTarget = useSelector(
    (state) => state.displaySettings.deleteTarget
  );
  const showDeleteLoader = useSelector(
    (state) => state.displaySettings.showDeleteLoader
  );

  const handleDeleteProject = (event) => {
    event.preventDefault();
    dispatch(setshowDeleteLoader(true));
    axios
      .delete(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/${deleteTarget}/${deleteId}/`
      )
      .then(() => {
        dispatch(setshowDeleteLoader(false));
        dispatch(setshowDeletePopup(false));
        dispatch(setdeletePopupMessage("Are you sure you want to delete?"));
        dispatch(setdeleteId(null));
        dispatch(setdeleteTarget(null));
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`Successfully Deleted  ${deleteId}`));
        dispatch(settoastType("success"));
        window.location.reload(true);
      })
      .catch(() => {
        dispatch(setshowDeleteLoader(false));
        dispatch(setshowDeletePopup(false));
        dispatch(setdeletePopupMessage("Are you sure you want to delete?"));
        dispatch(setdeleteId(null));
        dispatch(setdeleteTarget(""));
        dispatch(setshowToast(true));
        dispatch(settoastMessage(`Failed To Delete  ${deleteId}`));
        dispatch(settoastType("error"));
      });
  };

  return (
    <>
      {showDeletePopup && (
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
            onSubmit={handleDeleteProject}
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
                  {deletePopupMessage}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={deleteId === null || deleteTarget === null}
                  type="submit"
                  fullWidth
                  variant={showDeleteLoader ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {showDeleteLoader ? null : `Delete`}
                  {showDeleteLoader ? <CircularProgress /> : null}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => {
                    dispatch(setshowDeletePopup(false));
                    dispatch(
                      setdeletePopupMessage("Are you sure you want to delete?")
                    );
                    dispatch(setdeleteId(null));
                    dispatch(setdeleteTarget(null));
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
