import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function MoreonMap() {
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
          sx={{ fontSize: 16, color: "#d51b60" }}
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
        {/* <Box sx={{ backgroundColor: "black", color: "white", opacity: 0.8 }}>
          <FormControlLabel
            sx={{ margin: 0, marginRight: 1 }}
            control={<Checkbox sx={{ color: "#d51b60" }} defaultChecked />}
            label="Band Information"
          />
        </Box>
        <Box sx={{ backgroundColor: "black", color: "white", opacity: 0.8 }}>
          <FormControlLabel
            sx={{ margin: 0, marginRight: 1 }}
            control={<Checkbox sx={{ color: "#d51b60" }} defaultChecked />}
            label="3D View"
          />
        </Box> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            opacity: 0.8,
          }}
        >
          <Button
            // fullWidth
            variant="contained"
            color="primary"
            onClick={handleDoneClick}
            sx={{ margin: 1 }}
          >
            3D View
          </Button>
          <Button
            // fullWidth
            variant="contained"
            color="primary"
            onClick={handleDoneClick}
            sx={{ margin: 1 }}
          >
            Band Information
          </Button>
          <Button
            // fullWidth
            variant="contained"
            color="primary"
            onClick={handleDoneClick}
            sx={{ margin: 1 }}
          >
            Upload Mesh
          </Button>
          <Button
            //   fullWidth
            onClick={handleDoneClick}
            sx={{ margin: 1 }}
            variant="contained"
            color="primary"
          >
            Upload Point cloud
          </Button>
        </Box>
      </Popover>
    </div>
  );
}
