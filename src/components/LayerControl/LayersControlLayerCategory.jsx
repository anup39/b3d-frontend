import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { List } from "@mui/material";
import { updateCheckedById } from "../../reducers/MapCategories";
import { useDispatch } from "react-redux";

// List

function LayersControlLayerCategory({ map, layer }) {
  const dispatch = useDispatch();
  const [opacity, setOpacity] = useState(0.5);
  const [style, setStyle] = useState({});
  const [checked, setChecked] = useState([1]);

  const updateOpacity = (evt) => {
    setOpacity(parseFloat(evt.target.value));
    const layerId = String(layer.project) + layer.full_name + "layer";

    const style = map.getStyle();
    const existingLayer = style.layers.find((layer) => layer.id === layerId);

    if (existingLayer) {
      map.setPaintProperty(
        layerId,
        "fill-opacity",
        parseFloat(evt.target.value)
      );
    }
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/category-style/?category=${
          layer.id
        }`
      )
      .then((response) => {
        const categoryStyle = response.data[0];
        setStyle(categoryStyle);
        setOpacity(categoryStyle.fill_opacity);
      });
  }, [layer.id]);

  const handleToggle = (layer) => () => {
    const currentIndex = checked.indexOf(layer);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(layer);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    const sourceId = String(layer.project) + layer.full_name + "source";
    const layerId = String(layer.project) + layer.full_name + "layer";

    if (newChecked.length === 2) {
      // dispatch(updateCheckedById({ id: layer.id, checked: true }));
      const url = `${
        import.meta.env.VITE_API_MAP_URL
      }/function_zxy_query_app_polygondata_by_project_category/{z}/{x}/{y}?project=${
        layer.project
      }&category=${layer.id}`;
      const source_layer =
        "function_zxy_query_app_polygondata_by_project_category";
      const newSource = {
        type: "vector",
        tiles: [url],
        // promoteId: "id",
      };
      map.addSource(sourceId, newSource);

      const newLayer = {
        id: layerId,
        type: "fill",
        source: sourceId,
        "source-layer": source_layer,
        layout: {},
        paint: {
          "fill-color": style.fill,
          "fill-outline-color": style.stroke,
          // "fill-opacity": [
          //   "case",
          //   ["boolean", ["feature-state", "hover"], false],
          //   1,
          //   style.fill_opacity,
          // ],
          "fill-opacity": parseFloat(style.fill_opacity),
        },
      };
      map.addLayer(newLayer);
    } else {
      const style = map.getStyle();
      const existingLayer = style.layers.find((layer) => layer.id === layerId);
      const existingSource = style.sources[sourceId];
      if (existingLayer) {
        // remove the layer from the map
        map.off("click", layerId);
        map.removeLayer(layerId);
      }
      if (existingSource) {
        // remove the source from the map
        map.removeSource(sourceId);
      }

      // dispatch(updateCheckedById({ id: layer.id, checked: false }));
    }
  };

  return (
    <div className="layers-control-layer category">
      <div>
        <List>
          <ListItem
            key={layer.id}
            secondaryAction={
              <Checkbox
                // edge="start"
                onChange={handleToggle(layer)}
                checked={checked.indexOf(layer) !== -1}
                inputProps={{
                  "aria-labelledby": `checkbox-list-secondary-label-${layer.id}`,
                }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText
                id={`checkbox-list-secondary-label-${layer.id}`}
                primary={layer.name}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <input
          style={{ marginLeft: "15px" }}
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={updateOpacity}
        />
      </div>
    </div>
  );
}

export default LayersControlLayerCategory;

LayersControlLayerCategory.propTypes = {
  layer: PropTypes.object,
  map: PropTypes.object,
};
