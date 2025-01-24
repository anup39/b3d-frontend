import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import MapIcon from "@mui/icons-material/Map";
import Tooltip from "@mui/material/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditProjectId,
  setOpenEditProjectForm,
  setOpenIndoorForm,
  setEditIndoorProjectId,
} from "../../reducers/Project";
import { useTranslation } from "react-i18next";
import {
  setdeleteId,
  setshowDeletePopup,
  setdeletePopupMessage,
  setdeleteTarget,
} from "../../reducers/DisplaySettings";
import ProjectEditForm from "./ProjectEditForm";
import { useGetRasterDataByProjectIdQuery } from "../../api/rasterDataApi";
import { useGetRolesDataByProjectIdQuery } from "../../api/rolesApi";

export default function ProjectCard({
  id,
  client_id,
  name,
  client_name,
  description,
  url,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [properties, setproperties] = useState([]);
  const [users, setusers] = useState([]);
  const group_name = useSelector((state) => state.auth.role.group_name);
  const permissions = useSelector((state) => state.auth?.role?.permissions);
  const [showProjectEditForm, setShowProjectEditForm] = useState(false);

  const { data: rasterDataByProjectId, refetch: refetchRasterData } =
    useGetRasterDataByProjectIdQuery({
      project: id,
    });

  const { data: rolesDataByProjectId, refetch: refetchRolesData } =
    useGetRolesDataByProjectIdQuery({
      project: id,
    });

  useEffect(() => {
    refetchRasterData()
      .then((res) => {
        setproperties(res.data);
      })
      .catch((error) => {
        console.log("refetchRasterData", error);
      });

    refetchRolesData()
      .then((res) => {
        setusers(res.data);
      })
      .catch((error) => {
        console.log("refetchRolesDataError", error);
      });
  }, [id, refetchRasterData, refetchRolesData]);

  // Remaining things to do :
  // const handleViewInMap = () => {
  //   navigate(`/map/project/${id}`);
  // };

  // const handleManageUsers = () => {
  //   navigate(`/manage-users/${id}`);
  // };

  const onFormOpen = (value) => {
    setShowProjectEditForm(value);
  };

  // remaining: to implement delete using rtk
  const handleDeleteProject = () => {
    refetchRasterData()
      .then((res) => {
        if (res?.data?.length > 0) {
          dispatch(setshowDeletePopup(true));
          dispatch(setdeleteId(null));
          dispatch(setdeleteTarget(null));
          dispatch(
            setdeletePopupMessage(
              `You cannot delete this Project when there is map?`
            )
          );
        } else {
          dispatch(setshowDeletePopup(true));
          dispatch(setdeletePopupMessage("Are you sure you want to delete?"));
          dispatch(setdeleteId(id));
          dispatch(setdeleteTarget("projects"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditProject = () => {
    setShowProjectEditForm(true);
  };

  const handleInspection = () => {
    navigate(`/projects/${client_id}/inspections/${id}`);
  };

  const handleViewInMap = () => {
    // dispatch(setshowMeasuringsPanel(false));
    // navigate(`/projects/${id}/Map`);
    window.location.replace(`/properties/${client_id}/${id}/Map`);
  };

  const handleEditURL = () => {
    dispatch(setOpenEditProjectForm(true));
    dispatch(setEditProjectId(id));
  };

  const handleProcess = () => {
    window.open("http://localhost:3000", "_blank");
  };

  const handleIndoor = () => {
    dispatch(setOpenIndoorForm(true));
    dispatch(setEditIndoorProjectId(id));
  };

  return (
    <>
      {showProjectEditForm ? (
        <ProjectEditForm
          client_id={client_id}
          project_id={id}
          name={name}
          description={description}
          onFormOpen={onFormOpen}
        ></ProjectEditForm>
      ) : null}

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
            <FolderIcon sx={{ width: 128, height: 128, color: "#65C9FF" }} />
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
                <Typography variant="body2" gutterBottom>
                  {t("Client") + " " + t("Name")} : {client_name}
                </Typography>
                <span>
                  <label>{t("ThreeDurl")} : </label>
                </span>
                {url !== "" ? (
                  <input disabled={true} style={{ width: 500 }} value={url} />
                ) : (
                  <span>{t("Not") + " " + t("Added") + " " + t("Yet")}</span>
                )}
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
                <Grid item></Grid>
                {group_name === "super_admin" || group_name === "admin" ? (
                  <>
                    {" "}
                    <Grid item>
                      <Tooltip title={t("ThreeDurl")}>
                        <Button
                          variant="contained"
                          onClick={handleEditURL}
                          sx={{ p: 0, "&:hover": { cursor: "pointer" } }}
                        >
                          {t("ThreeDurl")}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("Process")}>
                        <Button
                          variant="contained"
                          onClick={handleProcess}
                          sx={{ p: 0, "&:hover": { cursor: "pointer" } }}
                        >
                          {t("Process")}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("Indoor")}>
                        <Button
                          variant="contained"
                          onClick={handleIndoor}
                          sx={{ p: 0, "&:hover": { cursor: "pointer" } }}
                        >
                          {t("Indoor")}
                        </Button>
                      </Tooltip>
                    </Grid>
                  </>
                ) : null}

                <Grid item>
                  {permissions && permissions.includes("delete_project") ? (
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
                      onClick={handleDeleteProject}
                    >
                      Delete
                    </Button>
                  ) : null}
                  {permissions && permissions.includes("change_project") ? (
                    <Button
                      sx={{
                        marginLeft: "10px",
                        p: 0,
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "#2265C0",
                        },
                      }}
                      onClick={handleEditProject}
                    >
                      Edit
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="text.secondary">
                {`${t("Total")}  ${t("Maps")}`}: {properties.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {/* Total Users: {users.length} */}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ marginTop: "25px" }}
                variant="contained"
                color="success"
                id="orthoButton"
                onClick={() => {
                  navigate(`/properties/${client_id}/${id}/List`);
                }}
              >
                {`${t("Manage")}  ${t("Maps")}`}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

ProjectCard.propTypes = {
  client_id: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  client_name: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  created_at: PropTypes.string,
};
