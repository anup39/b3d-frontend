import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { changeDistinctMatchedCategory } from "../../reducers/UploadMeasuring";

export default function AutoCompleteMap({
  index,
  category,
  main_index,
  layer,
}) {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  // const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);

  const client_id = useSelector((state) => state.client.clientDetail.client_id);

  useEffect(() => {
    if (client_id && layer) {
      let type_of_geometry = null;
      if (main_index === 0) {
        type_of_geometry = "Polygon";
      } else if (main_index === 1) {
        type_of_geometry = "LineString";
      } else if (main_index === 2) {
        type_of_geometry = "Point";
      }
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/${category}/?client=${parseInt(client_id)}&type_of_geometry=${
            type_of_geometry ? type_of_geometry : ""
          }`
        )
        .then((response) => {
          setOptions(response.data);
          setValue(
            response.data.find(
              (option) => option.id === layer.matched_category
            ) || null
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [client_id, category, layer, main_index]);
  return (
    <Autocomplete
      disablePortal
      disableClearable
      id="autocomplete-upload-category"
      options={options}
      getOptionLabel={(option) =>
        option.sub_category_name.charAt(0).toUpperCase() +
        option.sub_category_name.slice(1) +
        " | " +
        option.name
      }
      sx={{ width: 400, fontFamily: "Roboto", fontSize: "7px" }}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ fontFamily: "Roboto", fontSize: "7px" }}
          // required
          // label={"Not Detected"}
          variant="outlined"
          // value={inputValue}
          // onChange={(event) => setInputValue(event.target.value)}
          placeholder="Not Detected"
        />
      )}
      onChange={(event, newValue) => {
        setValue(newValue);
        dispatch(
          changeDistinctMatchedCategory({
            index: index,
            main_index: main_index,
            selected_category: newValue.id,
            // matched_category: newValue.name,
          })
        );
        // if (newValue) {
        //   setInputValue(
        //     newValue.full_name + " " + `(${newValue.type_of_geometry})`
        //   );
        //   dispatch(
        //     changeDistinctMatchedCategory({
        //       id: layer.id,
        //       matched_category: newValue.id,
        //     })
        //   );
        // } else {
        //   setInputValue("");
        //   dispatch(
        //     changeDistinctMatchedCategory({
        //       id: layer.id,
        //       matched_category: null,
        //     })
        //   );
        // }
      }}
    />
  );
}

AutoCompleteMap.propTypes = {
  category: PropTypes.string,
  layer: PropTypes.object,
  index: PropTypes.number,
  main_index: PropTypes.number,
};
