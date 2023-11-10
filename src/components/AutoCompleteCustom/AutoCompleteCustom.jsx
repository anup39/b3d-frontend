import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function AutoCompleteCustom({ onItemSelected, category }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-${category}/`)
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
      id="category-select"
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
          onItemSelected(newValue.id, newValue.standard_category);
        }
      }}
    />
  );
}

AutoCompleteCustom.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  category: PropTypes.string,
};
