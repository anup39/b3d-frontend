import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import { Button, Tooltip } from "@mui/material";
import RasterForm from "../components/RasterForm/RasterForm";
import UploadProgress from "../components/UploadProgress/UploadProgress";
import RasterContainer from "../components/RasterContainer/RasterContainer";

export default function Orthophotos() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const onProgressForm = (value) => {
    setIsProgressFormOpen(value);
  };

  const onProgressValue = (value) => {
    setProgress(value);
  };

  // const onSetRasters = (value) => {s
  //   setRasters(value);
  // };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/projects/${id}/`)
      .then((res) => {
        setProjectName(res.data.name);
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
        // onSetRasters={onSetRasters}
      />
      <UploadProgress
        isProgressFormOpen={isProgressFormOpen}
        onProgressForm={onProgressForm}
        progress={progress}
      />

      <RasterContainer id={id}></RasterContainer>
    </>
  );
}
