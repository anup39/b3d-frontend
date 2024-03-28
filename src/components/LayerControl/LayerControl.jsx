import ReactDOM from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";
import LayersAndWidgetPanel from "./LayersAndWidgetPanel";

export default class LayersControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";

    return this._container;
  }

  updateProject(popUpRef) {
    this._popUpRef = popUpRef;

    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <LayersAndWidgetPanel map={this._map} popUpRef={this._popUpRef} />
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
