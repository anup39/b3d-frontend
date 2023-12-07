import ReactDOM from "react-dom/client";
import DrawPolygon from "./DrawPolygon";
import LineString from "./LineString";
import Save from "./Save";
import Cancel from "./Cancel";
import { store } from "../../store";
import { Provider } from "react-redux";
import Point from "./Point";

export default class DrawControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <div className="maplibregl-ctrl-draw-control">
          <DrawPolygon />
          <LineString />
          <Point />
          <Cancel />
          <Save />
        </div>
      </Provider>
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
