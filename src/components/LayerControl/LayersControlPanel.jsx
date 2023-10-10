import PropTypes from "prop-types";
import "./LayersControlPanel.scss";
import LayersControlLayerStandard from "./LayersControlLayerStandard";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function LayersControlPanel({
  map,
  categories_measuring,
  sub_categories,
  standard_categories,
  onClose,
}) {
  let content = "";

  if (!standard_categories.length) {
    content = (
      <span>
        <i className="loading fa fa-circle-notch fa-spin"></i>{" "}
        {"No any Measurings yet"}
      </span>
    );
  } else {
    content = (
      <div>
        {standard_categories.length ? (
          <div className="overlays theme-border-primary">
            {standard_categories.map((layer, i) => (
              <LayersControlLayerStandard
                map={map}
                expanded={false}
                layer={layer}
                key={i}
                sub_categories={sub_categories}
                categories_measuring={categories_measuring}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  return (
    <div className="layers-control-panel">
      <div>
        <HighlightOffIcon
          className="close-button"
          onClick={onClose}
        ></HighlightOffIcon>
        <div className="title">{"Measurings"}</div>
      </div>
      <hr />
      {content}
    </div>
  );
}

LayersControlPanel.defaultProps = {
  categories_measuring: [],
  sub_categories: [],
  standard_categories: [],
};

LayersControlPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  categories_measuring: PropTypes.array,
  standard_categories: PropTypes.array,
  sub_categories: PropTypes.array,
  map: PropTypes.object.isRequired,
};

export default LayersControlPanel;
