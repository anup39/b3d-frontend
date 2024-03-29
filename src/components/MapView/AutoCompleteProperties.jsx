import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { setprojects } from "../../reducers/Project";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { fi } from "date-fns/locale";

export default function AutoCompleteProperties() {
  const dispatch = useDispatch();
  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );

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
    if (client_id) {
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
    }
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

AutoCompleteProperties.propTypes = {};
