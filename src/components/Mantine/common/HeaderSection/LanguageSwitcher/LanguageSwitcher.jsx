import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Select } from "@mantine/core";

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
  const [value, setValue] = useState(language);

  return (
    <Select
      data={[{ value: "react", label: "React library" }]}
      value={value ? value.value : null}
      onChange={(_value, option) => setValue(option)}
    />
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
