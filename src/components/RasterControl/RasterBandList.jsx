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
import axios from "axios";

export default function RasterBandList() {
  const dispatch = useDispatch();
  const current_band_infomation = useSelector(
    (state) => state.mapView.currentMapDetail.current_band_infomation
  );
  const selected_tif = useSelector(
    (state) => state.mapView.currentMapDetail.selected_tif
  );

  const handleChange = (event, band) => {
    const checked = event.target.checked;
    dispatch(setCurrentBandCheckedInfomation({ checked, band }));
    // Map logic here
    // console.log(
    //   selected_tif.id,
    //   band,
    //   current_band_infomation.band_red.color,
    //   current_band_infomation.band_red.checked
    // );
    const map = window.map_global;
    const id = selected_tif.id;
    if (checked) {
      axios
        .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
        .then((res) => {
          if (res.data.bounds) {
            const bounds = res.data.bounds;
            map.fitBounds(bounds);
            map.addSource(`${id}-${band}-source`, {
              type: "raster",
              tiles: [
                `${
                  import.meta.env.VITE_API_RASTER_URL
                }/tile-singleband-async/${id}/${band}/ffff/{z}/{x}/{y}.png`,
              ],
              tileSize: 512,
            });

            map.addLayer({
              id: `${id}-${band}-layer`,
              type: "raster",
              source: `${id}-${band}-source`,
              minzoom: 0,
              maxzoom: 24,
            });
            map.moveLayer(`${id}-${band}-layer`, "Continent labels");
            // dispatch(addSelectedTifId(tif_id));
          }
          // dispatch(setcurrentTif(tif));
        })
        .catch(() => {});
    } else {
      // dispatch(removeSelectedTifId(tif_id));
      const style = map.getStyle();
      const existingLayer = style.layers.find(
        (layer) => layer.id === `${id}-${band}-layer`
      );
      const existingSource = style.sources[`${id}-${band}-source`];
      if (existingLayer) {
        map.off("click", `${id}-${band}-layer`);
        map.removeLayer(`${id}-${band}-layer`);
        // dispatch(setcurrentTif(null));
      }
      if (existingSource) {
        map.removeSource(`${id}-${band}-source`);
      }
    }
  };

  const handleColorChange = (event, band) => {
    const color = event.target.value;
    dispatch(setCurrentBandColorInfomation({ color, band }));
  };

  const handleDoneColorChange = (band) => {
    // Logic to hit api call for tif
    if (band === "red") {
      console.log(
        selected_tif.id,
        band,
        current_band_infomation.band_red.color,
        current_band_infomation.band_red.checked
      );
    }
    if (band === "green") {
      console.log(
        selected_tif.id,
        band,
        current_band_infomation.band_green.color,
        current_band_infomation.band_green.checked
      );
    }
    if (band === "blue") {
      console.log(
        selected_tif.id,
        band,
        current_band_infomation.band_blue.color,
        current_band_infomation.band_blue.checked
      );
    }
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
            <CheckCircleIcon
              onClick={() => handleDoneColorChange("red")}
              sx={{ color: "#D51B60" }}
            />
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
            <CheckCircleIcon
              onClick={() => handleDoneColorChange("green")}
              sx={{ color: "#D51B60" }}
            />
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
            <CheckCircleIcon
              onClick={() => handleDoneColorChange("blue")}
              sx={{ color: "#D51B60" }}
            />
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
