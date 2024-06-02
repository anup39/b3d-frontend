import ReactDOM from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";
import PieChartComp from "./PieChartComp";

export default class PieChartControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        <PieChartComp showCloseButton={true} showHeading={true} />
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
