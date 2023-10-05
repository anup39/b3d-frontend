import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function AutoCompleteMap({
  onItemSelected,
  category,
  project_id,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Make an API call to fetch the data from the provided endpoint.
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/${category}/?project=${project_id}`
      )
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.full_name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label={category}
          variant="outlined"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      onChange={(event, newValue) => {
        if (newValue) {
          setInputValue(newValue.full_name);
          onItemSelected(newValue.id, newValue.standard_category); // Pass the selected ID to the parent component.
        }
      }}
    />
  );
}

AutoCompleteMap.propTypes = {
  onItemSelected: PropTypes.func.isRequired, // Ensure it's a function and required
  category: PropTypes.string,
  project_id: PropTypes.string,
};
