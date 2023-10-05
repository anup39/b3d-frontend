import { useState } from "react";
import PropTypes from "prop-types";
import LayersControlPanel from "./LayersControlPanel";
import "./LayersControlButton.scss";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";

export default function LayersControlButton(props) {
  const [showPanel, setShowPanel] = useState(false);

  const handleOpen = () => {
    setShowPanel(true);
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  return (
    <div className={showPanel ? "open" : ""}>
      <IconButton
        sx={{ color: "#C62828", backgroundColor: "#FFFFFF" }}
        onClick={handleOpen}
      >
        <LayersIcon />
      </IconButton>
      <LayersControlPanel
        map={props.map}
        categories_measuring={props.categories_measuring}
        sub_categories={props.sub_categories}
        standard_categories={props.standard_categories}
        project_name={props.project_name}
        project_id={props.project_id}
        onClose={handleClose}
      />
    </div>
  );
}

LayersControlButton.propTypes = {
  standard_categories: PropTypes.array,
  sub_categories: PropTypes.array,
  categories_measuring: PropTypes.array,
  map: PropTypes.object.isRequired,
  project_name: PropTypes.string,
  project_id: PropTypes.number,
};
