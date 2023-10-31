import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RasterLayer({ map, project_id }) {
  const [checked, setChecked] = useState([1]);
  const [orthophotos, setOrthophotos] = useState([]);

  const handleToggle = (ortho) => () => {
    const currentIndex = checked.indexOf(ortho);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(ortho);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    if (newChecked.length === 2) {
      axios
        .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${ortho.id}`)
        .then((res) => {
          if (res.data.bounds) {
            const bounds = res.data.bounds;
            map.fitBounds(bounds);
            map.addSource(`${ortho.uuid}-source`, {
              type: "raster",
              // use the tiles option to specify a WMS tile source URL
              // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
              tiles: [
                `${import.meta.env}/tile-async/${
                  ortho.id
                }/{z}/{x}/{y}.png?r=red&g=green&b=blue&tile_size=[512,512]&r_range=[0,255]&g_range=[0,255]&b_range=[0,255]&bounds=[${
                  bounds[0]
                },${bounds[1]},${bounds[2]},${bounds[3]}]`,
              ],
              tileSize: 512,
            });

            map.addLayer({
              id: `${ortho.uuid}-layer`,
              type: "raster",
              source: `${ortho.uuid}-source`,
              minzoom: 0,
              maxzoom: 24,
            });
            map.moveLayer(
              `${ortho.uuid}-layer`,
              "gl-draw-polygon-fill-inactive.cold"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const style = map.getStyle();
      const existingLayer = style.layers.find(
        (layer) => layer.id === `${ortho.uuid}-layer`
      );
      const existingSource = style.sources[`${ortho.uuid}-source`];
      if (existingLayer) {
        // remove the layer from the map
        map.off("click", `${ortho.uuid}-layer`);
        map.removeLayer(`${ortho.uuid}-layer`);
      }
      if (existingSource) {
        // remove the source from the map
        map.removeSource(`${ortho.uuid}-source`);
      }
    }
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/raster-data/?project=${project_id}`
      )
      .then((res) => {
        setOrthophotos(res.data);
      });
  }, [project_id]);

  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      {orthophotos.map((ortho) => {
        const labelId = `checkbox-list-secondary-label-${ortho.id}`;
        return (
          <ListItem
            key={ortho.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(ortho)}
                checked={checked.indexOf(ortho) !== -1}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={labelId} primary={ortho.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

RasterLayer.propTypes = {
  map: PropTypes.object,
  project_id: PropTypes.string,
};
