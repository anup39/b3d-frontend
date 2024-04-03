import ReactDOM from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";

import TableMeasuringsForMap from "./TableMesuringsForMap";

export default class TableMeasuringsForMapControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <TableMeasuringsForMap width={550} />
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
