import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  settoastType,
  settoastMessage,
  setshowToast,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import {
  createIndoorByProjectId,
  fetchIndoorsByProjectId,
} from "../../api/api";
import {
  setOpenIndoorForm,
  setEditIndoorProjectId,
} from "../../reducers/Project";
import IndoorCard from "./IndoorCard";
import { setIndoors } from "../../reducers/Project";

export default function IndoorForm({ client_id }) {
  const dispatch = useDispatch();
  const openForm = useSelector((state) => state.project.openIndoorForm);
  const project_id = useSelector((state) => state.project.editIndoorProjectId);
  const indoors = useSelector((state) => state.project.indoors);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const user_id = useSelector((state) => state.auth.user_id);

  console.log("project_id", project_id);

  const closeForm = () => {
    dispatch(setOpenIndoorForm(false));
    dispatch(setEditIndoorProjectId(null));
  };

  const handleCreateIndoor = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      name: name,
      url: url,
      client: client_id,
      project: project_id,
      created_by: user_id,
      is_display: true,
    };
    createIndoorByProjectId(data)
      .then((res) => {
        console.log(res, "res patch of indoor");
        fetchIndoorsByProjectId(project_id).then((res) => {
          console.log(res, "res fetch indoors");
          dispatch(setIndoors(res));
        });

        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Successfully Created Indoor"));
        dispatch(settoastType("success"));
        // closeForm();
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to create Indoor"));
        dispatch(settoastType("error"));
      });
  };

  useEffect(() => {
    if (project_id) {
      fetchIndoorsByProjectId(project_id).then((res) => {
        console.log(res, "res fetch indoors");
        dispatch(setIndoors(res));
      });
    }
  });

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
            onSubmit={handleCreateIndoor}
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
                  required
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                ></TextField>
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
                {indoors.length > 0 ? (
                  <>
                    {indoors.map((indoor) => (
                      <IndoorCard key={indoor.id} indoor={indoor} />
                    ))}
                  </>
                ) : (
                  <>
                    <Typography sx={{ ml: "41%" }}>No indoors yet.</Typography>
                  </>
                )}
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
