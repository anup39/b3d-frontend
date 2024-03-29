import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import { filterProjects } from "../../reducers/Project";
import { setSearchText } from "../../reducers/MapView";
import { IconButton, Tooltip } from "@mui/material";

export default function AutoCompleteProperties() {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.mapView.searchText);

  return (
    <Box
      sx={{
        display: "flex",
        alingItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#F5F5F5",
      }}
    >
      <TextField
        sx={{
          width: 173,
          fontFamily: "Roboto",
          fontSize: "5px",
          marginTop: "5px",
          marginBottom: "10px",
          marginLeft: "11px",
        }}
        size="small"
        value={searchText}
        onChange={(event) => {
          dispatch(filterProjects(event.target.value));
          dispatch(setSearchText(event.target.value));
        }}
        id="search-properties"
        label="Search Properties"
        variant="outlined"
      />

      <IconButton
        sx={{ borderRadius: 0 }}
        onClick={() => {
          dispatch(filterProjects(""));
          dispatch(setSearchText(""));
        }}
        size="small"
      >
        <Tooltip title="Clear Search" placement="top">
          <CancelIcon sx={{ fontSize: 20, color: "#E91E62" }} />
        </Tooltip>
      </IconButton>
    </Box>
  );
}

AutoCompleteProperties.propTypes = {};
