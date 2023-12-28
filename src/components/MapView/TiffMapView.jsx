import { Box, Tooltip } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import MoreonMap from "./MoreonMap";
import PropTypes from "prop-types";
import ButtonBase from "@mui/material/ButtonBase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setshowMeasuringsPanel } from "../../reducers/MapView";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 5,
});

export default function TiffMapView({ tif }) {
  const dispatch = useDispatch();
  const handleTifChecked = (event, tif_id) => {
    const checked = event.target.checked;
    const id = tif_id;
    const map = window.map_global;
    if (checked) {
      axios
        .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
        .then((res) => {
          if (res.data.bounds) {
            const bounds = res.data.bounds;
            map.fitBounds(bounds);
            map.addSource(`${id}-source`, {
              type: "raster",
              tiles: [
                `${
                  import.meta.env.VITE_API_RASTER_URL
                }/tile-async/${id}/{z}/{x}/{y}.png`,
              ],
              tileSize: 512,
            });

            map.addLayer({
              id: `${id}-layer`,
              type: "raster",
              source: `${id}-source`,
              minzoom: 0,
              maxzoom: 24,
            });
            map.moveLayer(`${id}-layer`, "gl-draw-polygon-fill-inactive.cold");
          }
        })
        .catch(() => {});
    } else {
      const style = map.getStyle();
      const existingLayer = style.layers.find(
        (layer) => layer.id === `${id}-layer`
      );
      const existingSource = style.sources[`${id}-source`];
      if (existingLayer) {
        map.off("click", `${id}-layer`);
        map.removeLayer(`${id}-layer`);
      }
      if (existingSource) {
        map.removeSource(`${id}-source`);
      }
    }
  };
  const handleMeasuringsPanelChecked = (event, tif_id) => {
    console.log(event, tif_id, "measurings ");
    const checked = event.target.checked;
    const id = tif_id;
    const map = window.map_global;
    if (checked) {
      dispatch(setshowMeasuringsPanel(true));
    } else {
      dispatch(setshowMeasuringsPanel(false));
    }
  };
  return (
    <Box>
      <ListItemButton
        key={tif.id}
        sx={{
          pl: 4,
          "&:hover": {
            backgroundColor: "#F1F7FF",
          },
          fontSize: 6,
        }}
      >
        <ListItemIcon sx={{ margin: 0, padding: 0, minWidth: "40px" }}>
          <ButtonBase sx={{ width: 30, height: 30 }}>
            <Img alt="complex" src={tif.screenshot_image} />
          </ButtonBase>
        </ListItemIcon>
        <ListItemText
          secondary={tif.name.slice(0, 10)}
          secondaryTypographyProps={{ fontSize: 13 }}
        />
        <Checkbox
          onChange={(event) => handleTifChecked(event, tif.id)}
          size="small"
          {...label}
          defaultChecked={false}
          sx={{
            color: pink[600],
            "&.Mui-checked": {
              color: pink[600],
            },
          }}
        />

        <Tooltip title="Show Measurings">
          <PinkSwitch
            onChange={(event) => handleMeasuringsPanelChecked(event, tif.id)}
            size="small"
            {...label}
            defaultChecked={false}
          />
        </Tooltip>
        <MoreonMap />
      </ListItemButton>
    </Box>
  );
}

TiffMapView.propTypes = {
  tif: PropTypes.object,
};
