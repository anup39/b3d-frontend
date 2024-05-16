import { Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndoor, setShowIndoorFrame } from "../../reducers/MapView";
import { useTranslation } from "react-i18next";

export default function IndoorFrame() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentIndoor = useSelector((state) => state.mapView.currentIndoor);
  const closeForm = () => {
    dispatch(setShowIndoorFrame(false));
    dispatch(setCurrentIndoor(null));
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <form
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "700px",
            background: "#fff",
            padding: "20px",
            zIndex: 10000,
            borderRadius: "5px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color: "black",
                }}
              >
                {currentIndoor?.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  {t("Close")}
                </Button>
                <Button
                  onClick={() => {
                    document.getElementById("indoorFrame").requestFullscreen();
                  }}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  {t("Full Screen")}
                </Button>
              </Box>
            </Box>
            <Box>
              <iframe
                id="indoorFrame"
                src={currentIndoor?.url}
                width="100%"
                height="600px"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Box>
          </Box>
        </form>
      </div>
    </>
  );
}

IndoorFrame.propTypes = {};
