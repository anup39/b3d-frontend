import React from "react";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

export default function GridNoRowsOverlay() {
  const { t } = useTranslation();
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {t("No") + " " + t("Data") + " " + t("Available")}
    </Stack>
  );
}
