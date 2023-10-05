import PropTypes from "prop-types";
import "./Toggle.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";

// import axios from "axios";

function Toggle({
  layer,
  map,
  visible,
  onVisible,
  style,
  trueIcon,
  component,
}) {
  const [transform, setTransform] = useState("rotate(-90deg)");
  const handleClick = () => {
    // console.log(map, "map");
    if (component == "expand" && !visible) {
      setTransform("rotate(360deg)");
    } else {
      setTransform("rotate(-90deg)");
    }
    onVisible(!visible);

    if (component == "checkbox") {
      const sourceId = String(layer.project) + layer.full_name + "source";
      const layerId = String(layer.project) + layer.full_name + "layer";

      if (!visible) {
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
        const existingLayer = style.layers.find(
          (layer) => layer.id === layerId
        );
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
      }
    }
  };

  return (
    <a className="toggle" onClick={handleClick}>
      {component === "expand" ? (
        <div className="layer-row">
          <ExpandMoreIcon
            style={{
              transform: transform,
              fontSize: "20px",
              backgroundColor: "#1876D1",
            }}
          />
          <Typography>{layer.name}</Typography>
        </div>
      ) : (
        <FormControlLabel
          control={
            <MuiCheckbox
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 24,
                },
              }}
            />
          }
          label={layer.name}
        />
      )}
    </a>
  );
}

Toggle.defaultProps = {
  trueIcon: "far fa-check-square",
  falseIcon: "far fa-square",
};

Toggle.propTypes = {
  trueIcon: PropTypes.string,
  falseIcon: PropTypes.string,
  style: PropTypes.object,
  layer: PropTypes.object,
  map: PropTypes.object,
  visible: PropTypes.bool,
  onVisible: PropTypes.func,
  component: PropTypes.string,
};

function Checkbox({ layer, map, visible, onVisible, style }) {
  return (
    <Toggle
      component="checkbox"
      layer={layer}
      map={map}
      visible={visible}
      onVisible={onVisible}
      style={style}
      trueIcon="far fa-check-square"
      falseIcon="far fa-square"
    />
  );
}

Checkbox.propTypes = {
  trueIcon: PropTypes.string,
  falseIcon: PropTypes.string,
  style: PropTypes.object,
  layer: PropTypes.object,
  map: PropTypes.object,
  visible: PropTypes.bool,
  onVisible: PropTypes.func,
};

function ExpandButton({ layer, expanded, onExpanded }) {
  return (
    <Toggle
      layer={layer}
      component="expand"
      visible={expanded}
      onVisible={onExpanded}
      trueIcon="fa fa-caret-down"
      falseIcon="fa fa-caret-right"
    />
  );
}

ExpandButton.propTypes = {
  expanded: PropTypes.bool,
  onExpanded: PropTypes.func,
  trueIcon: PropTypes.string,
  falseIcon: PropTypes.string,
  layer: PropTypes.object,
};

export { Checkbox, ExpandButton };
