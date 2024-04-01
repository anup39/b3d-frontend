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
import { useDispatch, useSelector } from "react-redux";
import { setcurrentTif } from "../../reducers/MapView";
import { setTifChecked } from "../../reducers/Tifs";
import { fetchBoundingBoxByTifId } from "../../api/api";
import AddRasterToMap from "../../maputils/AddRasterToMap";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 5,
});
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TiffMapView({ projectId }) {
  const map = window.map_global;
  const dispatch = useDispatch();
  const project_id = useSelector((state) => state.project.project_id);
  const tifs = useSelector((state) => state.tifs.tifs);
  const { current_tif } = useSelector(
    (state) => state.mapView.currentMapDetail
  );

  const handleTifChecked = (event, tif_id, tif) => {
    const checked = event.target.checked;
    dispatch(setTifChecked({ tif_id, checked }));
    if (current_tif) {
      const layerId = `${current_tif.id}-layer`;
      const sourceId = `${current_tif.id}-source`;
      RemoveSourceAndLayerFromMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
      });
    }
    if (checked) {
      dispatch(setcurrentTif(tif));
      fetchBoundingBoxByTifId(tif.id).then((res) => {
        if (res) {
          const bounds = res;
          const layerId = `${tif_id}-layer`;
          const sourceId = `${tif_id}-source`;
          const url = `${import.meta.env.VITE_API_RASTER_URL}/tile-async/${
            tif.id
          }/{z}/{x}/{y}.png`;

          AddRasterToMap({
            map: map,
            layerId: layerId,
            sourceId: sourceId,
            url: url,
            source_layer: sourceId,
            zoomToLayer: true,
            extent: bounds,
            type: "raster",
            component: "project-view",
          });
        }
      });
    } else {
      dispatch(setcurrentTif(null));
      const layerId = `${tif_id}-layer`;
      const sourceId = `${tif_id}-source`;
      RemoveSourceAndLayerFromMap({
        map: map,
        layerId: layerId,
        sourceId: sourceId,
      });
    }
  };

  return (
    <>
      {tifs.length > 0
        ? tifs.map((tif) => (
            <Box key={tif.id}>
              <ListItemButton
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
                  checked={tif.checked}
                  onChange={(event) => handleTifChecked(event, tif.id, tif)}
                  size="small"
                  {...label}
                  sx={{
                    color: pink[600],
                    "&.Mui-checked": {
                      color: pink[600],
                    },
                  }}
                  disabled={project_id === projectId ? false : true}
                />
                {project_id === projectId ? <MoreonMap tif={tif} /> : null}
              </ListItemButton>
            </Box>
          ))
        : null}
    </>
  );
}

TiffMapView.propTypes = {
  tif: PropTypes.object,
  projectId: PropTypes.number,
};
