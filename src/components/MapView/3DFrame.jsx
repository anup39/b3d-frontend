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
              <Box>
                {" "}
                <Typography color={"red"}>
                  If you are not logged in to Dronedeploy. Use this credentials
                </Typography>
                <Box>
                  {" "}
                  <label>User: </label>
                  <span>portal@b3d.dk</span>
                </Box>
                <Box>
                  <label>Password: </label>
                  <span>B3dportal</span>
                </Box>
              </Box>

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
                    document.getElementById("threeDFrame").requestFullscreen();
                  }}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  {t("Full Screen")}
                </Button>
              </Box>
            </Box>

            {currentThreeD.url ? (
              <Box>
                <iframe
                  id="threeDFrame"
                  src={currentThreeD?.url}
                  width="100%"
                  height="600px"
                  allowFullScreen
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
                No 3D information available
              </Box>
            )}
          </Box>
        </form>
      </div>
    </>
  );
}

ThreeDFrame.propTypes = {};
