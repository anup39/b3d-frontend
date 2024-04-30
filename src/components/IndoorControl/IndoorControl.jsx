import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import Cancel from "../DrawControl/Cancel";
import { useDispatch, useSelector } from "react-redux";
import {
  setIndoorsInMap,
  setShowIndoorControl,
  setCurrentIndoor,
  setShowIndoorFrame,
} from "../../reducers/MapView";
import { useEffect } from "react";
export default function IndoorControl() {
  const dispatch = useDispatch();
  const indoorsInMap = useSelector((state) => state.mapView.indoorsInMap);

  useEffect(() => {
    return () => {
      dispatch(setIndoorsInMap([]));
      dispatch(setCurrentIndoor(null));
    };
  }, [dispatch]);

  const handleViewIndoor = (indoor) => () => {
    dispatch(setCurrentIndoor(indoor));
    dispatch(setShowIndoorFrame(true));
  };
  return (
    <Box
      sx={{
        position: "absolute",
        top: "12px",
        right: "220px",
        zIndex: 9999,
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "white",
        },
        color: "#D51B60",
        borderRadius: "5px",
        minWidth: "200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ml: 1,
          paddingLeft: "7px",
          //   paddingRight: "5px",
          //   backgroundColor: "#BDBDBD",
        }}
      >
        <Typography>Available Indoors</Typography>
        <Tooltip title="Close">
          <IconButton onClick={() => dispatch(setShowIndoorControl(false))}>
            <Cancel />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        <Box>
          <>
            {indoorsInMap.length > 0 ? (
              <>
                {indoorsInMap.map((indoor) => (
                  <Box
                    key={indoor.id}
                    sx={{
                      gap: 5,
                      margin: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ color: "black", ml: 2 }}>
                      {indoor.name}
                    </Typography>
                    <Button
                      onClick={handleViewIndoor(indoor)}
                      sx={{ m: 0, p: 0 }}
                      variant="contained"
                    >
                      {" "}
                      View
                    </Button>
                  </Box>
                ))}
              </>
            ) : (
              <Typography
                sx={{
                  color: "black",
                  ml: "20px",
                  mb: 2,
                  mt: 2,
                }}
              >
                No indoors yet
              </Typography>
            )}
          </>
        </Box>
      </Box>
    </Box>
  );
}
