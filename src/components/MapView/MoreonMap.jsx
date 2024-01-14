import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { Box, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  resetCurrentBandCheckedInfomation,
  setSelectedTif,
  setshowTifPanel,
} from "../../reducers/MapView";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function MoreonMap({ tif }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const selected_tif = useSelector(
    (state) => state.mapView.currentMapDetail.selected_tif
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDoneClick = () => {
    setAnchorEl(null);
  };

  const handleBandInfoClick = () => {
    setAnchorEl(null);
    dispatch(setshowTifPanel(true));
    dispatch(setSelectedTif(tif));
    if (selected_tif?.id !== tif.id) {
      dispatch(resetCurrentBandCheckedInfomation());
    }
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
            onClick={handleBandInfoClick}
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

MoreonMap.propTypes = {
  tif: PropTypes.object,
};
