import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setprojects } from "../../reducers/Project";
import PropTypes from "prop-types";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useTranslation } from "react-i18next";
import {
  useCreateProjectMutation,
  useGetProjectsByClientIdQuery,
} from "../../api/projectApi";

export default function ProjectForm({ client_id }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);
  const [createProject] = useCreateProjectMutation();

  const { refetch: refetchProjectsByClientId } =
    useGetProjectsByClientIdQuery(client_id);

  const handleCreateProject = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    data.append("client", client_id);
    data.append("created_by", user_id);
    data.append("is_display", true);
    createProject({ data })
      .unwrap()
      .then(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Successfully")}  ${t("Created")} ${t("Property")}  `
          )
        );
        dispatch(settoastType("success"));
        closeForm();
        refetchProjectsByClientId().then((res) => {
          dispatch(setprojects(res.data));
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Failed")}  ${t("To")} ${t("Create")}  ${t("Property")}  `
          )
        );
        dispatch(settoastType("error"));
        closeForm();
      });
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Tooltip title={t("Create") + " " + t("Property")}>
        <Button
          onClick={openForm}
          sx={{ margin: "5px" }}
          variant="contained"
          color="error"
        >
          {t("Create") + " " + t("Property")}
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
            onSubmit={handleCreateProject}
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
                  label={t("Name")}
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
                  label={t("Address")}
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
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? null : `${t("Create")} ${t("Property")}`}
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
      )}
    </>
  );
}

ProjectForm.propTypes = {
  client_id: PropTypes.string,
};
