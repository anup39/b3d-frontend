import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

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
      }}
    >
      <TextField
        sx={{
          width: 175,
          fontFamily: "Roboto",
          fontSize: "5px",
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "15px",
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
          <CloseIcon sx={{ fontSize: 20, color: "#E91E62" }} />
        </Tooltip>
      </IconButton>
    </Box>
  );
}

AutoCompleteProperties.propTypes = {};
