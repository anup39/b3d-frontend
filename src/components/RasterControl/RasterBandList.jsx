import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentBandCheckedInfomation,
  setCurrentBandColorInfomation,
} from "../../reducers/MapView";

export default function RasterBandList() {
  const dispatch = useDispatch();
  const current_band_infomation = useSelector(
    (state) => state.mapView.currentMapDetail.current_band_infomation
  );
  // const [checked, setChecked] = React.useState(false);

  const handleChange = (event, band) => {
    const checked = event.target.checked;
    // setChecked(event.target.checked);
    dispatch(setCurrentBandCheckedInfomation({ checked, band }));
  };

  const handleColorChange = (event, band) => {
    const color = event.target.value;
    dispatch(setCurrentBandColorInfomation({ color, band }));
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
            <Checkbox
              size="small"
              checked={current_band_infomation.band_red.checked}
              // defaultChecked={false}
              onChange={(event) => {
                handleChange(event, "red");
              }}
            />
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
            onChange={(event) => {
              handleColorChange(event, "red");
            }}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value={current_band_infomation.band_red.color}
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
            <CheckCircleIcon sx={{ color: "#D51B60" }} />
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
            <Checkbox
              size="small"
              // defaultChecked={false}
              checked={current_band_infomation.band_green.checked}
              onChange={(event) => {
                handleChange(event, "green");
              }}
            />
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
            onChange={(event) => {
              handleColorChange(event, "green");
            }}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value={current_band_infomation.band_green.color}
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
            <CheckCircleIcon sx={{ color: "#D51B60" }} />
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
          label="Blue Channel"
          control={
            <Checkbox
              size="small"
              checked={current_band_infomation.band_blue.checked}
              // defaultChecked={false}
              onChange={(event) => {
                handleChange(event, "blue");
              }}
            />
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
            onChange={(event) => {
              handleColorChange(event, "blue");
            }}
            style={{ width: "25px", height: "20px", margin: "2px" }}
            type="color"
            id="favcolor"
            name="favcolor"
            value={current_band_infomation.band_blue.color}
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
            <CheckCircleIcon sx={{ color: "#D51B60" }} />
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
