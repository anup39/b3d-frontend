import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function MapLoader() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
        zIndex: 999999, // Higher z-index to cover other elements
        borderRadius: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: "20px",
          zIndex: 100000,
          borderRadius: 10,
        }}
      >
        <Box>
          <CircularProgress sx={{ margin: 2 }} />
          <Typography sx={{ marginLeft: 1 }}>{t("Loading")}</Typography>
        </Box>
      </div>
    </div>
  );
}
