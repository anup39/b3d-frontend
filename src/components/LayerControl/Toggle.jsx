import PropTypes from "prop-types";
import "./Toggle.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Typography } from "@mui/material";

// import axios from "axios";

function Toggle({ layer, visible, onVisible, component }) {
  const [transform, setTransform] = useState("rotate(-90deg)");
  const handleClick = () => {
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
              backgroundColor: "#1876D1",
            }}
          />
          <Typography>{layer.name}</Typography>
        </div>
      ) : null}
    </a>
  );
}

Toggle.propTypes = {
  layer: PropTypes.object,
  visible: PropTypes.bool,
  onVisible: PropTypes.func,
  component: PropTypes.string,
};

function ExpandButton({ layer, expanded, onExpanded }) {
  return (
    <Toggle
      layer={layer}
      component="expand"
      visible={expanded}
      onVisible={onExpanded}
    />
  );
}

ExpandButton.propTypes = {
  expanded: PropTypes.bool,
  onExpanded: PropTypes.func,
  layer: PropTypes.object,
};

export { ExpandButton };
