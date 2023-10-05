import PropTypes from "prop-types";
import "./Toggle.scss";
// import axios from "axios";

function Toggle({ layer, map, visible, onVisible, style, trueIcon }) {
  const handleClick = () => {
    console.log(layer, "layer");
    console.log(style, "style");
    console.log(map, "map");
    onVisible(!visible);
  };

  return (
    <a className="toggle" onClick={handleClick}>
      {trueIcon === "fa fa-caret-right" || trueIcon === "fa fa-caret-down" ? (
        <button>E</button>
      ) : (
        <input type="checkbox"></input>
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
};

function Checkbox({ layer, map, visible, onVisible, style }) {
  return (
    <Toggle
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

function ExpandButton({ expanded, onExpanded }) {
  return (
    <Toggle
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
};

export { Checkbox, ExpandButton };
