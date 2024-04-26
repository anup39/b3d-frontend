import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function AutoCompleteRole({ onItemSelected }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/groups/`)
      .then((response) => {
        const filtered_group = response.data.filter(
          (group) => group.name !== "admin"
        );
        setOptions(filtered_group);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <Autocomplete
      disablePortal
      id="role-select"
      options={options}
      getOptionLabel={(option) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label={"Select Group"}
          variant="outlined"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      onChange={(event, newValue) => {
        if (newValue) {
          setInputValue(newValue.name);
          onItemSelected(newValue.id, newValue.id);
        }
      }}
    />
  );
}

AutoCompleteRole.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
