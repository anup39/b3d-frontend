import React from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setshowAssignPropertiesPopup } from "../../reducers/DisplaySettings";
import TransferListProject from "./TrasferListProject";
import PropTypes from "prop-types";

export default function AssignPropertiesToUser({ client_id }) {
  const dispatch = useDispatch();
  const assignProperitesUser = useSelector(
    (state) => state.users.assignProperitesUser
  );
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
          zIndex: 9999,
        }}
      >
        <form
          // onSubmit={handleCreateUserRole}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
            borderRadius: "5px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography>Assign Properties to </Typography>
                <Typography
                  sx={{
                    color: "blue",
                  }}
                >
                  {assignProperitesUser ? assignProperitesUser.username : null}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TransferListProject client_id={client_id} />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "blue",
                  }}
                  onClick={() => {
                    dispatch(setshowAssignPropertiesPopup(false));
                  }}
                >
                  Save
                </Button>
                <Button
                  sx={{
                    backgroundColor: "red",
                  }}
                  variant="contained"
                  onClick={() => {
                    dispatch(setshowAssignPropertiesPopup(false));
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

AssignPropertiesToUser.propTypes = {
  client_id: PropTypes.string,
};
