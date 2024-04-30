import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  settoastType,
  settoastMessage,
  setshowToast,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchProjectsByClientIdAndIds,
  fetchProjectsByClientId,
  updateProjectById,
} from "../../api/api";
import { setprojects } from "../../reducers/Project";

export default function URL3d({ openForm, client_id, project_id, onOpenForm }) {
  const dispatch = useDispatch();
  const group_name = useSelector((state) => state.auth.role.group_name);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const projects_ = useSelector((state) => state.auth.role.project);

  const handleCreateUserRole = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      url: url,
    };
    updateProjectById({ project_id, data })
      .then((res) => {
        console.log(res, "res patch of url");

        if (
          (group_name && group_name === "super_admin") ||
          group_name === "admin"
        ) {
          fetchProjectsByClientId(client_id).then((res) => {
            const updatedProjects = res.map((project) => {
              return {
                ...project,
                checked: false,
                openProperties: false,
              };
            });

            dispatch(setprojects(updatedProjects));
          });
        }

        if (group_name === "editor" || group_name === "viewer") {
          if (projects_.length > 0) {
            fetchProjectsByClientIdAndIds(client_id, projects_).then((res) => {
              const updatedProjects = res.map((project) => {
                return {
                  ...project,
                  checked: false,
                  openProperties: false,
                };
              });

              dispatch(setprojects(updatedProjects));
            });
          }
        }
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Successfully Added 3D URL"));
        dispatch(settoastType("success"));
        closeForm();
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(settoastMessage("Failed to add 3D URL"));
        dispatch(settoastType("error"));
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
                  placeholder="Add 3D url"
                  onChange={(e) => setUrl(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : "Add 3D URL"}
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

URL3d.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
  openForm: PropTypes.bool,
  onOpenForm: PropTypes.func,
};
