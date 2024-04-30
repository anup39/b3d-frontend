import React from "react";
import Stack from "@mui/material/Stack";

export default function GridNoRowsOverlay() {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      Either none of category is checked or no data available
    </Stack>
  );
}
