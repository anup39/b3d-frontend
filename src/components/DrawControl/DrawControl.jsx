import ReactDOM from "react-dom/client";
import Save from "./Save";
import Cancel from "./Cancel";
import { store } from "../../store";
import { Provider } from "react-redux";

export default class DrawControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    return this._container;
  }

  updateDrawControl(popUpRef) {
    this._popUpRef = popUpRef;
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <div className="maplibregl-ctrl-draw-control">
          <Cancel popUpRef={this._popUpRef} />
          <Save popUpRef={this._popUpRef} />
        </div>
      </Provider>
    );
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
