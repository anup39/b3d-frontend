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
import {
  setprojects,
  setOpenEditProjectForm,
  setEditProjectId,
} from "../../reducers/Project";
import { useTranslation } from "react-i18next";

export default function URL3d({ client_id }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const openForm = useSelector((state) => state.project.openEditProjectForm);
  const group_name = useSelector((state) => state.auth.role.group_name);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const projects_ = useSelector((state) => state.auth.role.project);
  const project_id = useSelector((state) => state.project.editProjectId);

  console.log("project_id", project_id);

  const handleEditRole = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      url: url,
    };
    updateProjectById(project_id, data)
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

        if (
          group_name === "editor" ||
          group_name === "viewer" ||
          group_name === "inspektor"
        ) {
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
        dispatch(
          settoastMessage(
            `${t("Successfully")}  ${t("Created")} ${t("ThreeDurl")}  `
          )
        );
        dispatch(settoastType("success"));
        closeForm();
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Failed")}  ${t("To")} ${t("Create")} ${t("ThreeDurl")} `
          )
        );
        dispatch(settoastType("error"));
      });
  };

  const closeForm = () => {
    dispatch(setOpenEditProjectForm(false));
    dispatch(setEditProjectId(null));
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
            onSubmit={handleEditRole}
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
                  fullWidth
                  required
                  placeholder={t("Add") + " " + t("ThreeDurl")}
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
                  {loading ? null : `${t("Add")} ${t("ThreeDurl")}`}
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
                  {t("Close")}
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
};
