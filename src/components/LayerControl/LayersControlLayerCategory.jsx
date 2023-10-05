import { useState, useEffect } from "react";
import { Checkbox } from "./Toggle";
import axios from "axios";
import PropTypes from "prop-types";

function LayersControlLayerCategory({ map, layer }) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.5);
  const [style, setStyle] = useState({});

  const updateOpacity = (evt) => {
    setOpacity(parseFloat(evt.target.value));
    const layer_name = layer.view_name;
    map.eachLayer(function (layer) {
      if (layer?.layer_name === layer_name) {
        const currentLayer = layer;
        currentLayer.eachLayer((mainlayer) => {
          const currentStyle = mainlayer.options;
          currentStyle.fillOpacity = evt.target.value;
          mainlayer.setStyle(currentStyle);
        });
      }
    });
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

  return (
    <div className="layers-control-layer category">
      <div>
        <Checkbox
          visible={visible}
          onVisible={(value) => {
            setVisible(value);
          }}
          map={map}
          layer={layer}
          style={style}
        />
        {/* <a title={layer.name} className="layer-label">
          {layer.name}
        </a> */}
        <input
          style={{ marginTop: "35px" }}
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
