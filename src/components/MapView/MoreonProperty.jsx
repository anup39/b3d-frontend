import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setshowTifUpload } from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  setClientIdProperty,
  setProjectIdProperty,
} from "../../reducers/Property";

export default function MoreonProperty({ project_id }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const client_id = useSelector((state) => state.client.clientDetail.client_id);

  const handleUploadOrthoClick = () => {
    console.log("clicked for upload");
    setAnchorEl(null);
    dispatch(setshowTifUpload(true));
    dispatch(setProjectIdProperty(String(project_id)));
    dispatch(setClientIdProperty(client_id));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Tooltip title="Show More">
        <MoreVertIcon
          onClick={handleClick}
          sx={{
            fontSize: 16,
            color: "#d51b60",
            cursor: "pointer",
            mr: 2,
            ml: 0,
          }}
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
            padding: "4px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadOrthoClick}
          >
            Upload Ortho
          </Button>
        </Box>
      </Popover>
    </div>
  );
}

MoreonProperty.propTypes = {
  project_id: PropTypes.number,
};
