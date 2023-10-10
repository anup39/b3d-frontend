import { useState } from "react";
import PropTypes from "prop-types";
import LayersControlPanel from "./LayersControlPanel";
import "./LayersControlButton.scss";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

export default function LayersControlButton({ map }) {
  const [showPanel, setShowPanel] = useState(false);
  const categories_measuring = useSelector(
    (state) => state.mapCategories.categories
  );
  const sub_categories = useSelector(
    (state) => state.mapCategories.sub_categories
  );
  const standard_categories = useSelector(
    (state) => state.mapCategories.standard_categories
  );
  const project_name = useSelector((state) => state.mapCategories.project_name);

  const handleOpen = () => {
    setShowPanel(true);
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  return (
    <div className={showPanel ? "open" : ""}>
      <Button variant="outlined" color="error">
        {project_name}
      </Button>
      <IconButton
        sx={{
          color: "white",
          backgroundColor: "#9C27B0",
          marginLeft: "5px",
          borderRadius: "0",
        }}
        onClick={handleOpen}
      >
        <LayersIcon />
      </IconButton>
      <LayersControlPanel
        map={map}
        onClose={handleClose}
        categories_measuring={categories_measuring}
        sub_categories={sub_categories}
        standard_categories={standard_categories}
      />
    </div>
  );
}

LayersControlButton.propTypes = {
  map: PropTypes.object.isRequired,
};
