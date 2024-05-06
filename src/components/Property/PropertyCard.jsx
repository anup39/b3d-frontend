import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import LinearProgressLabel from "./LinearProgressLabel";
import { useTranslation } from "react-i18next";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2);
}

export default function PropertyCard({
  id,
  name,
  status,
  file_size,
  progress,
  task_id,
  file_name,
  projection,
  thumbnail,
  client_name,
  project_name,
}) {
  // Remaning things to work in next version

  // const navigate = useNavigate();
  // const handleViewInMapProperty = () => {
  // console.log("map");
  // navigate(`/map/${properti}/${1}`);
  // };
  // const handleDeleteProperty = () => {
  //   console.log("Delete ", id);
  //   navigate(`/map/${id}`);
  // };

  // const handleReprocessProperty = () => {
  //   // navigate(`/map/${id}`);
  //   console.log("Reprocess", id);
  // };

  // const handleGetWMS = () => {};
  const { t } = useTranslation();

  const tms_url = `${
    import.meta.env.VITE_API_RASTER_URL
  }/tile-async/${id}/{z}/{x}/{y}.png`;

  const wmts_url = `${
    import.meta.env.VITE_API_RASTER_URL
  }/${id}/ows/?SERVICE=WMTS&REQUEST=GetCapabilites`;

  return (
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
      <Grid container spacing={1} sx={{ flexDirection: "row" }}>
        <Grid item>
          <ButtonBase sx={{ width: 350, height: 200 }}>
            <Img alt="complex" src={thumbnail} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>{t("Name")} </b>: {name}
              </Typography>
              <Typography sx={{ fontSize: "13px" }} variant="subtitle1">
                <b>
                  {t("File")} {t("Name")}
                </b>{" "}
                : {file_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Projection")}
                <b> </b>: {projection}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("File")} {t("Size")}
                <b> </b>: {bytesToMB(file_size)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Task")} {t("Id")}
                <b></b>: {task_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("Status")}
                <b> </b>: {status}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("Client")} {t("Name")}
                <b></b>: {client_name}
              </Typography>{" "}
              <Typography variant="body2" gutterBottom>
                {t("Property")} {t("Name")}
                <b> </b>: {project_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>TMS/XYZ:</b> {tms_url}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>WMTS OGC :</b> {wmts_url}
              </Typography>
              <LinearProgressLabel value={progress}></LinearProgressLabel>
            </Grid>
            <Grid item xs container direction="row" spacing={2}>
              <Grid item>
                {/* <button className="btn-main" onClick={handleViewInMapProperty}>
                  View In Map
                </button> */}
                {/* <button className="btn-main" onClick={handleGetWMS}>
                  GET WMS/XYZ */}
                {/* </button> */}
              </Grid>
              <Grid item>
                {/* <button className="btn-main" onClick={handleReprocessProperty}>
                  Reprocess
                </button> */}
              </Grid>
              <Grid item>
                {/* <button className="btn-main" onClick={handleDeleteProperty}>
                  Delete
                </button> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

PropertyCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.string,
  file_size: PropTypes.number,
  progress: PropTypes.number,
  created_at: PropTypes.string,
  task_id: PropTypes.string,
  file_name: PropTypes.string,
  projection: PropTypes.string,
  thumbnail: PropTypes.string,
  client_name: PropTypes.string,
  project_name: PropTypes.string,
};
