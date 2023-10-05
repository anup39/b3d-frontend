import { useState } from "react";
import { ExpandButton } from "./Toggle";
import LayersControlLayerCategory from "./LayersControlLayerCategory";
import PropTypes from "prop-types";

function LayersControlLayerSubCategory({
  map,
  expanded,
  layer,
  categories_measuring,
}) {
  const [expanded_, setExpanded] = useState(expanded);

  const filtered = categories_measuring.filter(
    (obj) => obj.sub_category === layer.id
  );

  return (
    <>
      <div className="layers-control-layer sub-category">
        <>
          <ExpandButton
            layer={layer}
            expanded={expanded_}
            onExpanded={(value) => {
              setExpanded(value);
            }}
          />
          {/* <a title={layer.name} className="layer-label">
            {layer.name}
          </a> */}
        </>
      </div>

      {expanded_
        ? filtered.map((layer, i) => (
            <LayersControlLayerCategory
              map={map}
              expanded={false}
              layer={layer}
              key={i}
            />
          ))
        : null}
    </>
  );
}

export default LayersControlLayerSubCategory;

LayersControlLayerSubCategory.propTypes = {
  layer: PropTypes.object,
  map: PropTypes.object,
  expanded: PropTypes.bool,
  categories_measuring: PropTypes.array,
};
