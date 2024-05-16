import { Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setShowThreeDFrame, setCurrentThreeD } from "../../reducers/MapView";
import { useTranslation } from "react-i18next";

export default function ThreeDFrame() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentThreeD = useSelector((state) => state.mapView.currentThreeD);
  const closeForm = () => {
    dispatch(setShowThreeDFrame(false));
    dispatch(setCurrentThreeD(null));
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
                {currentThreeD?.name}
              </Typography>
              <Button
                onClick={closeForm}
                variant="contained"
                color="error"
                size="small"
              >
                {t("Close")}
              </Button>
            </Box>

            {currentThreeD.url ? (
              <Box>
                <iframe
                  src={currentThreeD?.url}
                  width="100%"
                  height="600px"
                ></iframe>
              </Box>
            ) : (
              <Box
                sx={{
                  color: "red",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                No 3D infromation
              </Box>
            )}
          </Box>
        </form>
      </div>
    </>
  );
}

ThreeDFrame.propTypes = {};
