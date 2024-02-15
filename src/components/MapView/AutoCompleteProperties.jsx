import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { setprojects } from "../../reducers/Project";
import { useDispatch } from "react-redux";

export default function AutoCompleteProperties({ open, client_id }) {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

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
      .then((res) => {
        // dispatch(setprojects(res.data));
        setOptions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, client_id]);
  return (
    <Autocomplete
      disablePortal
      size="small"
      id="category-select"
      options={options}
      getOptionLabel={(option) => option.name}
      sx={{ width: 200, my: 1, ml: 2, display: open ? "block" : "none" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Search Properties"}
          variant="outlined"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      onChange={(event, newValue) => {
        if (newValue) {
          setInputValue(newValue.full_name);
          // onItemSelected(newValue.id, newValue.standard_category);
        }
      }}
    />
  );
}

AutoCompleteProperties.propTypes = {
  client_id: PropTypes.string,
  open: PropTypes.bool,
};
