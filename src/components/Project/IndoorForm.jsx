import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  settoastType,
  settoastMessage,
  setshowToast,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import {} from "../../api/api";
import {
  setOpenIndoorForm,
  setEditIndoorProjectId,
} from "../../reducers/Project";
import IndoorCard from "./IndoorCard";

export default function IndoorForm({ client_id }) {
  const dispatch = useDispatch();
  const openForm = useSelector((state) => state.project.openIndoorForm);
  const project_id = useSelector((state) => state.project.editIndoorProjectId);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  console.log("project_id", project_id);

  const closeForm = () => {
    dispatch(setOpenIndoorForm(false));
    dispatch(setEditIndoorProjectId(null));
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
            // onSubmit={handleEditRole}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "700px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} display={"flex"} gap={1} alignItems={"center"}>
                <TextField
                  fullWidth
                  required
                  placeholder="Add url"
                  onChange={(e) => setUrl(e.target.value)}
                ></TextField>

                <Button
                  //   fullWidth

                  sx={{ pl: 4, pr: 3, height: 50 }}
                  type="submit"
                  variant={loading ? "outlined" : "contained"}
                >
                  {loading ? null : "Add URL"}
                  {loading ? <CircularProgress /> : null}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <IndoorCard />
              </Grid>

              <Grid item xs={12}>
                <Button
                  sx={{ ml: "45%" }}
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  //   fullWidth
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

IndoorForm.propTypes = {
  client_id: PropTypes.string,
};
