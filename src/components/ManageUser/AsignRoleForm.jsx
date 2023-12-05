import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import AutoCompleteCustom from "../StandardCategory/AutoCompleteCustom";
import PropTypes from "prop-types";
import {
  settoastType,
  settoastMessage,
  setshowToast,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";

export default function AsignRoleForm({ openForm, user_id, onOpenForm }) {
  const dispatch = useDispatch();
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateUserRole = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      role: selectedUserRole,
    };
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/?id=${user_id}`)
      .then((res) => {
        const role_id = res.data[0].id;
        axios
          .put(
            `${import.meta.env.VITE_API_DASHBOARD_URL}/user-role/${role_id}/`,
            data
          )
          .then(() => {
            window.location.reload(true);
            setLoading(false);
            dispatch(setshowToast(true));
            dispatch(settoastMessage("Successfully Created User Role"));
            dispatch(settoastType("success"));
            closeForm();
          })
          .catch(() => {
            setLoading(false);
            dispatch(setshowToast(true));
            dispatch(settoastMessage("Failed to Change the Role"));
            dispatch(settoastType("error"));
          });
      });
  };

  const closeForm = () => {
    onOpenForm(false);
  };

  return (
    <>
      {openForm ? (
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
            onSubmit={handleCreateUserRole}
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
                <TextField
                  id="user"
                  name="user"
                  label="user"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={user_id}
                  required
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <AutoCompleteCustom
                  onItemSelected={(id) => setSelectedUserRole(id)}
                  category={"roles"}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Create Role"}
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
      ) : null}
    </>
  );
}

AsignRoleForm.propTypes = {
  user_id: PropTypes.number,
  openForm: PropTypes.bool,
  onOpenForm: PropTypes.func,
};
