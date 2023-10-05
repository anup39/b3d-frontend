import ReactDOM from "react-dom/client";
import LayersControlButton from "./LayersControlButton";
import { categories } from "./categories";

export default class LayersControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl";

    ReactDOM.createRoot(this._container).render(
      <LayersControlButton
        map={this._map}
        categories_measuring={categories.categories_measuring}
        sub_categories={categories.sub_categories}
        standard_categories={categories.standard_categories}
        project_name="Project One"
        project_id={1}
      />
    );

    return this._container;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
