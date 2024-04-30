import { Box, Typography, Button, IconButton } from "@mui/material";
import Cancel from "../DrawControl/Cancel";
import { useDispatch } from "react-redux";
import { setShowIndoorControl } from "../../reducers/MapView";
export default function IndoorControl() {
  const dispatch = useDispatch();
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
          marginLeft: "10px",
        }}
      >
        <Typography>Available Indoors</Typography>
        <IconButton onClick={() => dispatch(setShowIndoorControl(false))}>
          <Cancel />
        </IconButton>
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
          <Box
            sx={{
              gap: 5,
              margin: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ color: "black" }}>Floor</Typography>
            <Button sx={{ m: 0, p: 0 }} variant="contained">
              {" "}
              View
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
