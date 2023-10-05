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
    console.log(layer, "layer");
    console.log(style, "style");
    // console.log(map, "map");
    if (component == "expand" && !visible) {
      setTransform("rotate(360deg)");
    } else {
      setTransform("rotate(-90deg)");
    }
    onVisible(!visible);
  };

  return (
    <a className="toggle" onClick={handleClick}>
      {component === "expand" ? (
        <div className="layer-row">
          <ExpandMoreIcon
            style={{
              transform: transform,
              fontSize: "20px",
              backgroundColor: "grey",
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
