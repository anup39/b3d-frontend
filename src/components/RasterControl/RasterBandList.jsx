import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import DoneIcon from "@mui/icons-material/Done";
import { Tooltip } from "@mui/material";

export default function RasterBandList() {
  const [checked, setChecked] = React.useState([0]);

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleColorChange = () => {
    console.log("color");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FormControlLabel
          slotProps={{
            typography: {
              fontSize: 12,
              color: "#6A6D70",
              fontWeight: 900,
            },
          }}
          label="Red Channel"
          control={
            <Checkbox size="small" checked={true} onChange={handleChange2} />
          }
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingRight: 1,
            "&:hover": { cursor: "pointer" },
          }}
        >
          <input
            onChange={handleColorChange}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value="#ff0000"
          ></input>
          <Tooltip
            sx={{
              fontSize: 19,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            title="Apply Color Map"
          >
            <DoneIcon sx={{ color: "#D51B60" }} />
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          slotProps={{
            typography: {
              fontSize: 12,
              color: "#6A6D70",
              fontWeight: 900,
            },
          }}
          label="Green Channel"
          control={
            <Checkbox size="small" checked={true} onChange={handleChange2} />
          }
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingRight: 1,
            "&:hover": { cursor: "pointer" },
          }}
        >
          <input
            onChange={handleColorChange}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value="#228B22"
          ></input>
          <Tooltip
            sx={{
              fontSize: 19,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            title="Apply Color Map"
          >
            <DoneIcon sx={{ color: "#D51B60" }} />
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FormControlLabel
          slotProps={{
            typography: {
              fontSize: 12,
              color: "#6A6D70",
              fontWeight: 900,
            },
          }}
          label="Red Channel"
          control={
            <Checkbox size="small" checked={true} onChange={handleChange2} />
          }
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingRight: 1,
            "&:hover": { cursor: "pointer" },
          }}
        >
          <input
            onChange={handleColorChange}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value="#0000FF"
          ></input>
          <Tooltip
            sx={{
              fontSize: 19,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            title="Apply Color Map"
          >
            <DoneIcon sx={{ color: "#D51B60" }} />
          </Tooltip>
        </Box>
      </Box>

      {/* <Box>
        {" "}
        <FormControlLabel
          slotProps={{
            typography: {
              fontSize: 12,
              color: "#6A6D70",
              fontWeight: 900,
            },
          }}
          label="NDVI"
          control={
            <Checkbox size="small" checked={true} onChange={handleChange2} />
          }
        />
      </Box> */}
    </Box>
  );
}
