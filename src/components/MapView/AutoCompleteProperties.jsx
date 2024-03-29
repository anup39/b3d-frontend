import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import { filterProjects } from "../../reducers/Project";

export default function AutoCompleteProperties() {
  const dispatch = useDispatch();

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
      onChange={(event) => {
        dispatch(filterProjects(event.target.value));
      }}
      id="search-properties"
      label="Search Properties"
      variant="outlined"
    />
  );
}

AutoCompleteProperties.propTypes = {};
