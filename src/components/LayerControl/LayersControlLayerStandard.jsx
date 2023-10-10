import { useState } from "react";
import PropTypes from "prop-types";
import "./LayersControlLayer.scss";
import { ExpandButton } from "./Toggle";
import LayersControlLayerSubCategory from "./LayersControlLayerSubCategory";

function LayersControlLayerStandard({
  map,
  expanded,
  layer,
  sub_categories,
  categories_measuring,
}) {
  const [expanded_, setExpanded] = useState(expanded);

  const filtered = sub_categories.filter(
    (obj) => obj.standard_category === layer.id
  );

  const onExpanded = (value) => {
    setExpanded(value);
  };

  return (
    <div className="layers-control-layer ">
      <>
        <ExpandButton
          layer={layer}
          expanded={expanded_}
          onExpanded={onExpanded}
        />
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
};

export default LayersControlLayerStandard;
