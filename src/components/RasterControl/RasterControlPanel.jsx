import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreLess from "@mui/icons-material/ExpandLess";
import { pink } from "@mui/material/colors";
import { useState } from "react";
import RasterBandList from "./RasterBandList";
import { useSelector } from "react-redux";

export default function RasterControlNew() {
  const [expandMap, setExpandMap] = useState(true);
  const showTifPanel = useSelector((state) => state.mapView.showTifPanel);

  const current_tif = useSelector(
    (state) => state.mapView.currentMapDetail.current_tif
  );

  const handleCloseMap = () => {
    setExpandMap(!expandMap);
  };
  return (
    <>
      {showTifPanel ? (
        <Box sx={{ minWidth: 200, maxHeight: 400 }}>
          <Box
            sx={{
              display: "flex",
              paddingTop: 2,
              paddingLeft: 2,
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#027FFE", fontWeight: 600 }}>
              Map :
            </Typography>
            <Typography
              sx={{
                paddingLeft: 1,
                color: "#7C7C7C",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {current_tif ? current_tif.name : null}
            </Typography>
          </Box>

          {expandMap ? <RasterBandList /> : null}

          {expandMap ? (
            <ExpandMoreLess
              onClick={handleCloseMap}
              sx={{
                ml: "50%",
                "&:hover": {
                  cursor: "pointer",
                },
                color: pink[600],
              }}
            />
          ) : (
            <ExpandMoreIcon
              onClick={handleCloseMap}
              sx={{
                ml: "50%",
                "&:hover": {
                  cursor: "pointer",
                },
                color: pink[600],
              }}
            />
          )}
        </Box>
      ) : null}
    </>
  );
}
