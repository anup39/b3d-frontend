import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const [language, setLanguage] = React.useState("en");
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-language-select-label">Language</InputLabel>
      <Select
        labelId="demo-language-select-label"
        id="demo-language-select"
        value={language}
        label="Language"
        defaultValue="en"
        onChange={handleChange}
      >
        <MenuItem value={"en"}>en</MenuItem>
        <MenuItem value={"da"}>da</MenuItem>
      </Select>
    </FormControl>
  );
}
