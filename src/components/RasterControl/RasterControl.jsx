import ReactDOM from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";
import RasterLayer from "./RasterLayer";

export default class RasterControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-raster";
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <RasterLayer></RasterLayer>
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
