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
        {/* <RasterLayer
            map={this._map}
            project_id={this._project_id}
          ></RasterLayer> */}
        {/* <RasterControlNew></RasterControlNew> */}
        <TableMeasuringsForMap />
      </Provider>
    );

    return this._container;
  }

  //   updateProject(project_id) {
  //     this._project_id = project_id;
  //     ReactDOM.createRoot(this._container).render(
  //       <Provider store={store}>
  //         {/* <RasterLayer
  //           map={this._map}
  //           project_id={this._project_id}
  //         ></RasterLayer> */}
  //         {/* <RasterControlNew></RasterControlNew> */}
  //         <TableMeasuringsForMap />
  //       </Provider>
  //     );
  //   }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
