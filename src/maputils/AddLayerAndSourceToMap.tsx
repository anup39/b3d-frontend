import axios from "axios";
import {
  Map,
  LngLatLike,
  SourceSpecification,
  CircleLayerSpecification,
  LayerSpecification,
  IControl,
} from "maplibre-gl";

interface AddLayerProps {
  map: Map;
  layerId: string;
  sourceId: string;
  url: string;
  source_layer: string;
  showPopup: boolean;
  style: { fill_color: string; fill_opacity: string; stroke_color: string };
  zoomToLayer: boolean;
  center: LngLatLike;
  fillType: string;
  trace: boolean;
  component: string;
}

function AddLayerAndSourceToMap({
  map,
  layerId,
  sourceId,
  url,
  source_layer,
  showPopup,
  style,
  zoomToLayer,
  center,
  fillType,
  trace,
}: AddLayerProps) {
  // Rest of your component code remains unchanged

  if (zoomToLayer) {
    axios
      .get(`${import.meta.env.VITE_API_MAP_URL}/${source_layer}`)
      .then(function (response) {
        const bounds = response.data.bounds;

        if (bounds && bounds.length === 4) {
          if (fillType === "point") {
            map.flyTo({ center: center });
          } else {
            map.fitBounds(bounds);
          }
        }
      })
      .catch(function () {});
  }

  const newSource: SourceSpecification = {
    type: "vector",
    tiles: [url],
    promoteId: "id",
  };

  map.addSource(sourceId, newSource);

  if (fillType && fillType === "point") {
    const newLayer: CircleLayerSpecification = {
      id: layerId,
      type: "circle",
      source: sourceId,
      "source-layer": source_layer,
      layout: {},
      paint: {
        "circle-color": style.fill_color,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          13,
          4,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "red",
          "black",
        ],
      },
    };
    map.addLayer(newLayer);
    // map.moveLayer(layerId, "gl-draw-polygon-fill-inactive.cold");
  } else {
    const newLayer: LayerSpecification = {
      id: layerId,
      type: "fill",
      source: sourceId,
      "source-layer": source_layer,
      layout: {},
      paint: {
        "fill-color": style.fill_color,
        "fill-outline-color": style.stroke_color,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.5,
        ],
      },
    };
    map.addLayer(newLayer);
    // map.moveLayer(layerId, "gl-draw-polygon-fill-inactive.cold");
  }
  let hoveredStateId: null = null!;

  if (showPopup) {
    map.on("mousemove", layerId, (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (!features.length) {
        return;
      } else {
        const feature = features[0];
        const popup_name: string = "PopupControl";
        // @ts-ignore
        const popup_index = map._controls.indexOf(popup_name);

        if (popup_index) {
          const popup_control: IControl =
            map._controls[map._controls.length - 1];
          // @ts-ignore
          popup_control.updatePopup(feature.properties, trace);
        }
      }
      // @ts-ignore
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState(
            {
              source: sourceId,
              id: hoveredStateId,
              sourceLayer: source_layer,
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
            sourceLayer: source_layer,
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
            sourceLayer: source_layer,
          },
          { hover: false }
        );
      }
    });
  }
}

export default AddLayerAndSourceToMap;
