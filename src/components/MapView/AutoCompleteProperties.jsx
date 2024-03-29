import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { filterProjects } from "../../reducers/Project";
import { setSearchText } from "../../reducers/MapView";

export default function AutoCompleteProperties() {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.mapView.searchText);

  return (
    <TextField
      sx={{
        width: 200,
        fontFamily: "Roboto",
        fontSize: "7px",
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
  );
}

AutoCompleteProperties.propTypes = {};
