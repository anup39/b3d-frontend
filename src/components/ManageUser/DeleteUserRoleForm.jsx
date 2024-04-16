import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import { setshowDeleteUserRolePopup } from "../../reducers/DisplaySettings";
import { setDeleteUserRoleId, setUsers } from "../../reducers/Users";
import PropTypes from "prop-types";

import axios from "axios";
export default function DeleteUserRoleForm({ client_id }) {
  const dispatch = useDispatch();
  const showDeleteUserRolePopup = useSelector(
    (state) => state.displaySettings.showDeleteUserRolePopup
  );
  const deleteUserRoleId = useSelector((state) => state.users.deleteUserRoleId);

  const handleDeleteUserRole = () => {
    if (!deleteUserRoleId) return;
    axios
      .delete(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/roles/${deleteUserRoleId}/`
      )
      .then(() => {
        dispatch(setshowDeleteUserRolePopup(false));
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/roles/?client=${client_id}`
          )
          .then((res) => {
            dispatch(setUsers(res.data));
            dispatch(setDeleteUserRoleId(null));
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
      });
  };
  return (
    <>
      {showDeleteUserRolePopup ? (
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
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
              borderRadius: "5px",
            }}
          >
            <Box>
              <Typography gutterBottom>
                Are you sure you want to delete this role?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button onClick={handleDeleteUserRole} variant="contained">
                  <Typography variant="button">Yes</Typography>
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setshowDeleteUserRolePopup(false));
                  }}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                  }}
                  variant="contained"
                >
                  <Typography variant="button">Cancel</Typography>
                </Button>
              </Box>
            </Box>
          </form>
        </div>
      ) : null}
    </>
  );
}

DeleteUserRoleForm.propTypes = {
  client_id: PropTypes.string.isRequired,
};
