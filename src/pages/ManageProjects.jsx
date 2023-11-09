import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import SimpleTransferList from "../components/SimpleTransferList/SimpleTransferList";
import { Button, Tooltip } from "@mui/material";

export default function ManageProjects() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/users/${id}/`)
      .then((res) => {
        setProjectName(res.data.username);
      });
  }, [id]);

  return (
    <>
      <AppBar></AppBar>

      <Box
        sx={{
          bgcolor: "background.paper",
          display: "block",
          height: 224,
          margin: 10,
        }}
      >
        <Tooltip>
          <Button
            sx={{ marginBottom: "25px" }}
            variant="outlined"
            color="error"
          >
            {projectName}
          </Button>
        </Tooltip>
        <SimpleTransferList id={parseInt(id)} component={"projects"} />
      </Box>
    </>
  );
}
