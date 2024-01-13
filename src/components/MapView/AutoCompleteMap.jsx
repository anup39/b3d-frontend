import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { changeDistinctMatchedCategory } from "../../reducers/UploadMeasuring";

export default function AutoCompleteMap({ category, layer }) {
  const dispatch = useDispatch();
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
      getOptionLabel={(option) =>
        option.full_name + " " + `(${option.type_of_geometry})`
      }
      sx={{ width: 400, fontFamily: "Roboto", fontSize: "7px" }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ fontFamily: "Roboto", fontSize: "7px" }}
          // required
          label={category}
          variant="outlined"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      onChange={(event, newValue) => {
        if (newValue) {
          setInputValue(
            newValue.full_name + " " + `(${newValue.type_of_geometry})`
          );
          dispatch(
            changeDistinctMatchedCategory({
              id: layer.id,
              matched_category: newValue.id,
            })
          );
        } else {
          setInputValue("");
          dispatch(
            changeDistinctMatchedCategory({
              id: layer.id,
              matched_category: null,
            })
          );
        }
      }}
    />
  );
}

AutoCompleteMap.propTypes = {
  category: PropTypes.string,
  layer: PropTypes.object,
};
