import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PropTypes from "prop-types";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import LinearProgressLabel from "../ProgressBar/LinearProgressLabel";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function ProjectCard({ id, name, description, created_at }) {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [orthophotos, setOrthophotos] = useState([]);

  const handleViewInMap = () => {
    navigate(`/map/${id}`);
  };

  const handleManageClasses = () => {
    navigate(`/manage-classes/${id}`);
  };
  // const handleUploadRaster = () => {};
  const handleUploadRaster = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const file_size_mb = (file.size / (1024 * 1024)).toFixed(0);

    const formData = new FormData();
    formData.append("project", id); // Add the project ID
    formData.append("name", file.name); // Add the file name
    formData.append("tif_file", file);
    formData.append("status", "Uploaded");
    formData.append("file_size", file_size_mb);

    axios
      .post(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      )
      .then((res) => {
        setUploadSuccess(true);
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/raster-data/?project=${id}`
          )
          .then((res) => {
            console.log("Raster file uplaoded : ", res.data);
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${id}`
      )
      .then((res) => {
        setOrthophotos(res.data);
      });
  }, [id]);

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
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img
              alt="complex"
              src="https://cdn-icons-png.flaticon.com/512/4212/4212570.png"
            />
          </ButtonBase>
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
              <Typography variant="body2" color="text.secondary">
                Created On: {created_at}
              </Typography>
            </Grid>
            <Grid item xs container direction="row" spacing={2}>
              <Grid item>
                <Button
                  onClick={handleViewInMap}
                  variant="contained"
                  color="success"
                >
                  View In Map
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleManageClasses}
                  variant="contained"
                  color="success"
                >
                  Manage Classes
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Tooltip>
              <Button
                sx={{ marginBottom: "25px" }}
                variant="outlined"
                color="error"
              >
                Orthophotos
              </Button>
            </Tooltip>

            <Typography gutterBottom variant="subtitle1" component="div">
              Total Orthophotos: {orthophotos.length}
            </Typography>
          </Grid>

          <Grid item>
            <Dropzone
              onDrop={handleUploadRaster}
              // accept={{ ".tif": "image/tiff" }}
              maxSize={50000000000} // 50000 MB
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button variant="contained" color="error" id="uploadButton">
                    Upload Raster
                  </Button>
                </div>
              )}
            </Dropzone>
            {/* {uploadProgress > 0 && ( */}
            {/* <LinearProgressLabel value={uploadProgress}></LinearProgressLabel> */}
            {/* )} */}
            {/* {uploadSuccess && <div>File uploaded successfully!</div>} */}

            <Button
              sx={{ marginTop: "25px" }}
              variant="contained"
              color="success"
              id="orthoButton"
              onClick={() => {
                navigate(`/orthophotos/${id}`);
              }}
            >
              Orthophotos
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

ProjectCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  created_at: PropTypes.string,
};
