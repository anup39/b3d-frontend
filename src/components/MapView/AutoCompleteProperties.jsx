import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { setprojects } from "../../reducers/Project";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

export default function AutoCompleteProperties({ client_id }) {
  const dispatch = useDispatch();

  const fetchProjects = debounce((searchTerm) => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/projects/?client=${client_id}&search=${searchTerm}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        dispatch(setprojects(res.data));
      });
  }, 100); // delay in milliseconds

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/projects/?client=${client_id}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {})
      .catch(() => {});
  }, [dispatch, client_id]);
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
        fetchProjects(event.target.value);
      }}
      id="search-properties"
      label="Search Properties"
      variant="outlined"
    />
  );
}

AutoCompleteProperties.propTypes = {
  client_id: PropTypes.string,
  open: PropTypes.bool,
};
