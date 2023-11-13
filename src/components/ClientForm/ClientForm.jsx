import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setclients } from "../../reducers/Client";

export default function ClientForm() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);
  //   const username_ = useSelector((state) => state.auth.username);

  const handleCreateClient = (event) => {
    // TODO : Create a user and then client

    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const data = {
      name: nameInput.value,
      description: descriptionInput.value,
      owner: user_id,
    };
    // axios
    //   .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, data)
    //   .then((res) => {
    //     axios
    //       .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, {
    //         // headers: {
    //         //   Authorization: "Token " + localStorage.getItem("token"), // Include the API token from localStorage in the 'Authorization' header
    //         // },
    //       })
    //       .then((res) => {
    //         dispatch(setclients(res.data));
    //       });
    //   })
    //   .catch(() => {
    //     // setOpenProjectErrorToast(true);
    //     // setOpenProjectSuccessToast(false);
    //     // setTimeout(() => {
    //     //   setOpenProjectErrorToast(false);
    //     // }, 3000);
    //   });
    closeForm();
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Tooltip title="Create Client">
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          Create Client
        </Button>
      </Tooltip>
      {isFormOpen && (
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
            onSubmit={handleCreateClient}
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
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
                >
                  Done
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
      )}
    </>
  );
}
