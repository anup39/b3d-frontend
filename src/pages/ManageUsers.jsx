import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import Box from "@mui/material/Box";
import UserTransferList from "../components/UserTransferList/UserTransferList";
import { Button, Tooltip } from "@mui/material";

export default function ManageUsers() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");

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
        <UserTransferList id={parseInt(id)} component={"users"} />
      </Box>
    </>
  );
}
