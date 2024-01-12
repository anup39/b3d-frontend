import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function AutoCompleteMap({ onItemSelected, category }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const client_id = useSelector(
    (state) => state.mapView.clientDetail.client_id
  );

  useEffect(() => {
    if (client_id) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/${category}/?client=${parseInt(client_id)}`
        )
        .then((response) => {
          setOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [client_id, category]);
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.full_name}
      sx={{ width: 400 }}
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

AutoCompleteMap.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  category: PropTypes.string,
  // project_id: PropTypes.string,
};
