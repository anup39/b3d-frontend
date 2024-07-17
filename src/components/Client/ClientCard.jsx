import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeleteLoader,
  setshowDeletePopup,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import FolderIcon from "@mui/icons-material/Folder";
import { setprojects } from "../../reducers/Project";
import MapIcon from "@mui/icons-material/Map";
import Tooltip from "@mui/material/Tooltip";
import AppsIcon from "@mui/icons-material/Apps";
import PeopleIcon from "@mui/icons-material/People";
// import { setshowMeasuringsPanel } from "../../reducers/MapView";
import { useTranslation } from "react-i18next";
import NewClientForm from "./NewClientForm";
import { useGetRasterDataByClientIdQuery } from "../../api/rasterDataApi";
import { useGetRolesDataByClientIdQuery } from "../../api/rolesApi";
import { useGetProjectsByClientIdQuery } from "../../api/projectApi";
import useEffectOnlyAfterMount from "../../hooks/useEffectOnlyAfterMount";

export default function ClientCard({ id, name, description }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const group_name = useSelector((state) => state.auth.role.group_name);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const permissions = useSelector((state) => state.auth?.role?.permissions);

  const { data: projectsByClientId, refetch: refetchProjectDataByClientId } =
    useGetProjectsByClientIdQuery(id);
  const { data: rasterDataByClientId, refetch: refetchRasterDataByClientId } =
    useGetRasterDataByClientIdQuery({ client: id });
  const { data: rolesDataByClientId, refetch: refetchRolesDataByClientId } =
    useGetRolesDataByClientIdQuery({ client: id });

  useEffectOnlyAfterMount(() => {
    refetchProjectDataByClientId();
    refetchRasterDataByClientId();
    refetchRolesDataByClientId();
  }, [id]);

  const handleViewInMap = () => {
    // dispatch(setshowMeasuringsPanel(false));
    // navigate(`/projects/${id}/Map`);
    window.location.replace(`/projects/${id}/Map`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  const handleManageUsers = () => {
    navigate(`/manage-users/${id}`);
  };

  const handleOpenClient = () => {
    navigate(`/projects/${id}/List`);
    dispatch(setprojects([]));
  };

  const openEditForm = () => {
    setIsEditFormOpen(true);
  };
  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleDeleteClient = () => {
    // TODO: "When a client is deleted delete user roles, permissions and users related to this client";

    if (projectsByClientId) {
      const initiateDeleteProcess = () => {
        dispatch(setshowDeleteLoader(true));
        dispatch(setshowDeletePopup(true));
        dispatch(setdeleteId(null));
        dispatch(setdeleteTarget(null));
        dispatch(
          setdeletePopupMessage(
            `Are you sure you want to delete Client ${name} and its content?`
          )
        );
      };
      const resetDeleteProcess = (message, id = null, target = null) => {
        dispatch(setshowDeleteLoader(false));
        dispatch(setshowDeletePopup(true));
        dispatch(setdeleteId(id));
        dispatch(setdeleteTarget(target));
        dispatch(setdeletePopupMessage(message));
      };
      initiateDeleteProcess();

      if (projectsByClientId?.length > 0) {
        resetDeleteProcess(
          `You cannot delete this Client when there is Property?`
        );
      } else {
        resetDeleteProcess(
          `Are you sure you want to delete Client ${name} and its content?`,
          id,
          "clients"
        );
      }
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastMessage("Failed to load total properties"));
      dispatch(settoastType(error));
    }
  };
  const handleEditClient = () => {
    openEditForm();
  };

  return (
    <>
      {isEditFormOpen && (
        <NewClientForm id={id} closeEditForm={closeEditForm} />
      )}
      <Paper
        sx={{
          p: 1,
          margin: 1,
          // maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <FolderIcon sx={{ width: 128, height: 128, color: "#23C9C9" }} />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {description}
                </Typography>
              </Grid>
              <Grid item xs container direction="row" spacing={1}>
                <Grid item>
                  <Tooltip title={t("Map") + " " + t("View")}>
                    <MapIcon
                      onClick={handleViewInMap}
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    />
                  </Tooltip>
                </Grid>
                {group_name === "super_admin" || group_name === "admin" ? (
                  <>
                    <Grid item>
                      <Tooltip title={t("Manage") + " " + t("Class")}>
                        <AppsIcon
                          onClick={handleManageClasses}
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("Manage") + " " + t("Users")}>
                        <PeopleIcon
                          onClick={handleManageUsers}
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        />
                      </Tooltip>
                    </Grid>
                  </>
                ) : null}
                {permissions && permissions.includes("delete_client") ? (
                  <Grid item>
                    <Button
                      sx={{
                        p: 0,
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "#2265C0",
                        },
                      }}
                      onClick={handleDeleteClient}
                    >
                      Delete
                    </Button>
                  </Grid>
                ) : null}

                {permissions && permissions.includes("change_client") ? (
                  <Grid item>
                    <Button
                      sx={{
                        p: 0,
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "#2265C0",
                        },
                      }}
                      onClick={handleEditClient}
                    >
                      Edit
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="text.secondary">
                {t("Total") + " " + t("Properties")} :{" "}
                {projectsByClientId?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Total") + " " + t("Maps")} : {rasterDataByClientId?.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Total") + " " + t("Users")} : {rolesDataByClientId?.length}
              </Typography>
            </Grid>

            <Grid item>
              <Button
                onClick={handleOpenClient}
                variant="contained"
                color="success"
              >
                {t("Open")}
              </Button>
            </Grid>
          </Grid>{" "}
        </Grid>
      </Paper>
    </>
  );
}

ClientCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
