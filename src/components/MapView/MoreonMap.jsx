import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
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
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
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
        {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        
        */}
        <Box sx={{ backgroundColor: "black", color: "white", opacity: 0.8 }}>
          <FormControlLabel
            sx={{ margin: 1 }}
            control={<Checkbox sx={{ color: "#d51b60" }} defaultChecked />}
            label="Band Information"
          />
          <Button sx={{ color: "#d51b60" }} onClick={handleDoneClick}>
            Done
          </Button>
        </Box>
      </Popover>
    </div>
  );
}
