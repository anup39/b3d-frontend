import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function MoreonProperty() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDoneClick = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Tooltip title="Show More">
        <MoreVertIcon
          onClick={handleClick}
          sx={{ fontSize: 16, color: "#d51b60", cursor: "pointer" }}
        />
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#333333",
            // borderRadius: 8,
            padding: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleDoneClick}
            sx={{ marginBottom: 1 }}
          >
            Upload Ortho
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDoneClick}
            sx={{ marginBottom: 1 }}
          >
            Upload Mesh
          </Button>
          <Button variant="contained" color="primary" onClick={handleDoneClick}>
            Upload Point cloud
          </Button>
        </Box>
      </Popover>
    </div>
  );
}
