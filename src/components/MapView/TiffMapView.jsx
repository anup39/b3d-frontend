import { Box } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { pink } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import MoreonMap from "./MoreonMap";
import PropTypes from "prop-types";
import ButtonBase from "@mui/material/ButtonBase";
import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addSelectedTifId,
//   removeSelectedTifId,
//   setshowMeasuringsPanel,
//   addcurrentTifMeasuringTable,
// } from "../../reducers/MapView";
import { useSelector } from "react-redux";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 5,
});

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TiffMapView({ tif, project_id }) {
  const current_project_measuring_table = useSelector(
    (state) => state.mapView.currentMapDetail.current_project_measuring_table
  );

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
            // dispatch(addSelectedTifId(tif_id));
          }
        })
        .catch(() => {});
    } else {
      // dispatch(removeSelectedTifId(tif_id));

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
          disabled={
            current_project_measuring_table === project_id ? false : true
          }
        />
        {current_project_measuring_table === project_id ? <MoreonMap /> : null}
      </ListItemButton>
    </Box>
  );
}

TiffMapView.propTypes = {
  tif: PropTypes.object,
};
