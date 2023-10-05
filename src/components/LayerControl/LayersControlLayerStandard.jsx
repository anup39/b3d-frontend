import { useState } from "react";
import PropTypes from "prop-types";
import "./LayersControlLayer.scss";
import { Checkbox } from "./Toggle";
import { ExpandButton } from "./Toggle";
import LayersControlLayerSubCategory from "./LayersControlLayerSubCategory";

function LayersControlLayerStandard({
  map,
  expanded,
  layer,
  sub_categories,
  categories_measuring,
  style,
}) {
  const [visible, setVisible] = useState(false);
  const [expanded_, setExpanded] = useState(expanded);

  const filtered = sub_categories.filter(
    (obj) => obj.standard_category === layer.id
  );

  const onVisible = (value) => {
    setVisible(value);
  };

  const onExpanded = (value) => {
    setExpanded(value);
  };

  return (
    <div className="layers-control-layer ">
      <>
        {layer.name === "All" ? (
          <Checkbox
            layer={layer}
            map={map}
            visible={visible}
            onVisible={onVisible}
            style={style[0]}
          />
        ) : (
          <ExpandButton expanded={expanded_} onExpanded={onExpanded} />
        )}
        <a title={layer.name} className="layer-label">
          {layer.name}
        </a>
      </>

      {expanded_
        ? filtered.map((layer, i) => (
            <LayersControlLayerSubCategory
              map={map}
              expanded={false}
              layer={layer}
              key={i}
              categories_measuring={categories_measuring}
            />
          ))
        : null}
    </div>
  );
}

LayersControlLayerStandard.defaultProps = {
  layer: null,
  expanded: false,
  map: null,
  sub_categories: [],
};

LayersControlLayerStandard.propTypes = {
  layer: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  map: PropTypes.object.isRequired,
  sub_categories: PropTypes.array,
  categories_measuring: PropTypes.array,
  style: PropTypes.array,
};

export default LayersControlLayerStandard;
