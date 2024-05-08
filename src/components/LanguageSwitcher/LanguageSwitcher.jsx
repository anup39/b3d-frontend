import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function LanguageSwitcher(props) {
  const [language, setLanguage] = React.useState(
    localStorage.getItem("i18nextLng") !== "en-GB"
      ? localStorage.getItem("i18nextLng")
      : "en"
  );
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };
  return (
    <FormControl
      sx={{
        position: props.position,
        top: props.top,
        right: props.right,
        zIndex: props.zIndex,
        margin: props.margin,
        padding: props.padding,
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
      }}
    >
      <InputLabel id="demo-language-select-label"></InputLabel>
      <Select
        labelId="demo-language-select-label"
        id="demo-language-select"
        value={language}
        label=""
        defaultValue="en"
        onChange={handleChange}
      >
        <MenuItem value={"en"}>en</MenuItem>
        <MenuItem value={"da"}>da</MenuItem>
      </Select>
    </FormControl>
  );
}

LanguageSwitcher.propTypes = {
  position: PropTypes.string,
  top: PropTypes.string,
  right: PropTypes.string,
  zIndex: PropTypes.number,
  margin: PropTypes.string,
  padding: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.string,
};
