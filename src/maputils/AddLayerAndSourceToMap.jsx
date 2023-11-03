import maplibregl from "maplibre-gl";
import axios from "axios";

function getPopupHTML(properties) {
  let html = "";
  for (const [key, value] of Object.entries(properties)) {
    html += `<b>${key}:</b> ${value}<br>`;
  }
  return html;
}
const AddLayerAndSourceToMap = ({
  map,
  layerId,
  sourceId,
  url,
  source_layer,
  showPopup,
  style,
  zoomToLayer,
  fillType,
}) => {
  if (zoomToLayer) {
    axios
      .get(`${import.meta.env.VITE_API_MAP_URL}/${source_layer}`)
      .then(function (response) {
        const bounds = response.data.bounds;
        if (bounds && bounds.length === 4) {
          map.fitBounds(bounds, {
            padding: 20,
            maxZoom: 10,
          });
        }
      })
      .catch(function () {});
  }

  const newSource = {
    type: "vector",
    tiles: [url],
  };

  map.addSource(sourceId, newSource);

  if (fillType && fillType === "line") {
    const newLayer = {
      id: layerId,
      type: "line",
      source: sourceId,
      "source-layer": source_layer,
      layout: {},
      paint: {
        "line-color": style.fill_color,
        "line-width": 1,
      },
    };
    map.addLayer(newLayer);
    // map.moveLayer(layerId, "gl-draw-polygon-fill-inactive.cold");
  } else {
    const newLayer = {
      id: layerId,
      type: "fill",
      source: sourceId,
      "source-layer": source_layer,
      layout: {},
      paint: {
        "fill-color": style.fill_color,
        "fill-opacity": style.fill_opacity,
        "fill-outline-color": style.stroke_color,
      },
    };
    map.addLayer(newLayer);
    // map.moveLayer(layerId, "gl-draw-polygon-fill-inactive.cold");
  }

  if (showPopup) {
    map.on("click", layerId, (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (!features.length) {
        return;
      }
      const feature = features[0];
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(getPopupHTML(feature.properties))
        .addTo(map);
    });
  }
};

export default AddLayerAndSourceToMap;
