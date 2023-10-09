import * as React from "react";
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
      // const map = window.map_global;
      map.addSource("wms-test-source", {
        type: "raster",
        // use the tiles option to specify a WMS tile source URL
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
        tiles: [
          "http://localhost:8080/geoserver/super_admingeoservertest/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=super_admingeoservertest:orthophoto",
        ],
        tileSize: 256,
      });

      map.addLayer({
        id: "wms-test-layer",
        type: "raster",
        source: "wms-test-source",
        paint: {},
      });

      map.fitBounds([
        [-107.88857386093723, 38.98669825126662], // southwestern corner of the bounds
        [-107.8871274949127, 38.98772137388136], // northeastern corner of the bounds
      ]);
    } else {
      const map = window.map_global;
      const style = map.getStyle();
      const existingLayer = style.layers.find(
        (layer) => layer.id === "wms-test-layer"
      );
      const existingSource = style.sources["wms-test-source"];
      if (existingLayer) {
        // remove the layer from the map
        map.off("click", "wms-test-layer");
        map.removeLayer("wms-test-layer");
      }
      if (existingSource) {
        // remove the source from the map
        map.removeSource("wms-test-source");
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
