import {
  Map,
  LngLatBounds,
  SourceSpecification,
  CircleLayerSpecification,
  LayerSpecification,
} from "maplibre-gl";
import { store } from "../store";
import { Provider } from "react-redux";
import Popup from "../components/PopupControl/Popup";
import ReactDOM, { Root } from "react-dom/client";
import { RefObject } from "react";

interface AddLayerProps {
  map: Map;
  layerId: string;
  sourceId: string;
  url: string;
  source_layer: string;
  showPopup: boolean;
  style: { fill_color: string; fill_opacity: string; stroke_color: string };
  zoomToLayer: boolean;
  extent: LngLatBounds;
  geomType: string;
  fillType: string;
  trace: boolean;
  component: string;
  popUpRef: RefObject<HTMLDivElement>;
}

function AddLayerAndSourceToMap({
  map,
  layerId,
  sourceId,
  url,
  source_layer,
  popUpRef,
  showPopup,
  style,
  zoomToLayer,
  extent,
  geomType,
  fillType,
  trace,
}: AddLayerProps) {
  // Rest of your component code remains unchanged

  if (zoomToLayer) {
    map.fitBounds(extent);
  }

  if (geomType && geomType === "geojson") {
    const newSourceGeojson: SourceSpecification = {
      type: "geojson",
      data: url,
    };
    map.addSource(sourceId, newSourceGeojson);
  } else {
    const newSource: SourceSpecification = {
      type: "vector",
      tiles: [url],
      promoteId: "id",
    };

    map.addSource(sourceId, newSource);
  }

  if (fillType && fillType === "circle") {
    const newLayer: CircleLayerSpecification = {
      id: layerId,
      type: "circle",
      source: sourceId,
      // "source-layer": source_layer,
      layout: {},
      paint: {
        "circle-color": style.fill_color,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          13,
          7,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "black",
          "black",
        ],
      },
    };
    map.addLayer(newLayer);
  } else if (fillType && fillType === "line") {
    const newLayer: LayerSpecification = {
      id: layerId,
      type: "line",
      source: sourceId,
      // "source-layer": source_layer,
      layout: {},
      paint: {
        "line-color": style.fill_color,
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          5,
          3,
        ],
      },
    };
    map.addLayer(newLayer);
  } else {
    const newLayer: LayerSpecification = {
      id: layerId,
      type: "fill",
      source: sourceId,
      // "source-layer": source_layer,
      layout: {},
      paint: {
        "fill-color": style.fill_color,
        "fill-outline-color": style.stroke_color,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.8,
          parseFloat(style.fill_opacity),
        ],
      },
      // filter: ["!=", ["id"], 65],
    };
    map.addLayer(newLayer);
  }

  let hoveredStateId: null = null!;

  if (showPopup) {
    map.on("click", layerId, (e) => {
      const features = map.queryRenderedFeatures(e.point);

      if (!features.length) {
        return;
      } else {
        // const popup = new maplibregl.Popup({
        //   closeOnClick: true,
        // });

        const feature = features[0];
        // const popup_name: string = "PopupControl";
        // @ts-ignore
        // const popup_index = map._controls.indexOf(popup_name);

        // if (popup_index) {
        // const popup_control: IControl =
        // map._controls[map._controls.length - 2];
        // @ts-ignore

        // @ts-ignore
        // console.log(feature.id, "id");
        // console.log(feature.properties, "propertrie");
        // popup_control.updatePopup(feature.properties, trace);

        // const popups = document.getElementsByClassName("maplibregl-popup");

        // if (popups.length) {
        //   popups[0].remove();
        // }

        // if (popUpRef.current.isOpen()) {
        const container = document.createElement("div");
        container.id = "popup-custom";
        const root = ReactDOM.createRoot(container);
        root.render(
          <Provider store={store}>
            <Popup
              properties={feature.properties}
              feature_id={feature.id}
              features={features}
            />
          </Provider>
        );
        popUpRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(container)
          .addTo(map);
        // }
        // }
      }
    });
  }

  map.on("mousemove", layerId, (e) => {
    // @ts-ignore
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState(
          {
            source: sourceId,
            id: hoveredStateId,
            // sourceLayer: source_layer,
          },
          { hover: false }
        );
      }
      // @ts-ignore
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        {
          source: sourceId,
          // @ts-ignore
          id: hoveredStateId,
          // sourceLayer: source_layer,
        },
        { hover: true }
      );
    }
  });

  map.on("mouseleave", layerId, () => {
    if (hoveredStateId) {
      map.setFeatureState(
        {
          source: sourceId,
          id: hoveredStateId,
          // sourceLayer: source_layer,
        },
        { hover: false }
      );
    }
  });
}

export default AddLayerAndSourceToMap;
