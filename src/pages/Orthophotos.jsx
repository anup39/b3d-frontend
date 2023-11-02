import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Button, Tooltip } from "@mui/material";
import RasterCard from "../components/RasterCard/RasterCard";
import { useSelector } from "react-redux";
import RasterForm from "../components/RasterForm/RasterForm";
import UploadProgress from "../components/UploadProgress/UploadProgress";

export default function Orthophotos() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rasters, setRasters] = useState([]);
  //   const rasters = useSelector((state) => state.raster.rasters);

  const onProgressForm = (value) => {
    setIsProgressFormOpen(value);
  };

  const onProgressValue = (value) => {
    setProgress(value);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/${id}/`)
      .then((res) => {
        setProjectName(res.data.name);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${id}`
      )
      .then((res) => {
        setRasters(res.data);
      });
  }, [id]);

  return (
    <>
      <AppBar></AppBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tooltip>
          <Button
            sx={{
              //   marginBottom: "15px",
              marginTop: "5px",
              marginLeft: "5px",
              marginRight: "5px",
            }}
            variant="outlined"
            color="error"
          >
            {projectName}
          </Button>
        </Tooltip>
      </Box>

      <RasterForm
        project_id={id}
        onProgressForm={onProgressForm}
        onProgressValue={onProgressValue}
      />
      <UploadProgress
        isProgressFormOpen={isProgressFormOpen}
        onProgressForm={onProgressForm}
        progress={progress}
      />

      <div>
        {rasters
          ? rasters.map((raster) => (
              <RasterCard
                key={raster.id}
                id={raster.id}
                name={raster.name}
                status={raster.status}
                file_size={raster.file_size}
                progress={raster.progress}
                created_on={raster.created_on}
                task_id={raster.task_id}
              />
            ))
          : null}
      </div>
    </>
  );
}
