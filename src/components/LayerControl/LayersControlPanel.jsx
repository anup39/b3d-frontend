import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./LayersControlPanel.scss";
import LayersControlLayerStandard from "./LayersControlLayerStandard";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function LayersControlPanel({
  map,
  categories_measuring,
  sub_categories,
  standard_categories,
  project_name,
  project_id,
  onClose,
}) {
  const [style, setStyle] = useState([]);

  useEffect(() => {
    if (project_id !== null) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_DASHBOARD_URL
          }/category-style/?project=${parseInt(project_id)}`
        )
        .then((response) => {
          setStyle(response.data);
        });
    }
  }, [project_id]);

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
            <LayersControlLayerStandard
              map={map}
              expanded={false}
              layer={{
                name: "All",
                view_name: project_name.replace(/ /g, "_").toLowerCase(),
              }}
              key={standard_categories.length + 1}
              sub_categories={sub_categories}
              categories_measuring={categories_measuring}
              style={style}
            />

            {standard_categories.map((layer, i) => (
              <LayersControlLayerStandard
                map={map}
                expanded={false}
                layer={layer}
                key={i}
                sub_categories={sub_categories}
                categories_measuring={categories_measuring}
                style={style}
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
        {/* <span className="close-button" onClick={onClose} /> */}
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
  project_name: "",
  project_id: 0,
};

LayersControlPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  categories_measuring: PropTypes.array,
  standard_categories: PropTypes.array,
  sub_categories: PropTypes.array,
  map: PropTypes.object.isRequired,
  project_name: PropTypes.string,
  project_id: PropTypes.string,
};

export default LayersControlPanel;
