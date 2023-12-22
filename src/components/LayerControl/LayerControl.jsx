import ReactDOM from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";
import LayersAndLabelControl from "./LayersAndLabelControl";
// import SwipeableEdgeDrawer from "./LayerDrawer";
import FixedBottomNavigation from "./LayerDrawer";

export default class LayersControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this._project_id = 1;

    return this._container;
  }

  updateProject(project_id) {
    this._project_id = project_id;
    ReactDOM.createRoot(this._container).render(
      <Provider store={store}>
        {/* <LayersControlButton map={this._map} /> */}
        <LayersAndLabelControl map={this._map} />
        {/* <SwipeableEdgeDrawer /> */}
        {/* <FixedBottomNavigation /> */}
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
