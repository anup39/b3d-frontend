import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";

export default function RasterLayer() {
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    if (newChecked.length === 2) {
      const map = window.map_global;
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

  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      {[0].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={labelId} primary={`orthophoto`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
