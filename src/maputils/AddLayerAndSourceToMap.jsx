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
        // handle success
        const bounds = response.data.bounds;
        // fit map to bounds
        if (bounds && bounds.length === 4) {
          map.fitBounds(bounds, {
            padding: 20,
            maxZoom: 10,
          });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error, "Fit bounds didnot work due to error");
      });
  }

  // create the new source object
  const newSource = {
    /* source options */
    type: "vector",
    tiles: [url],
  };
  // add the source to the map
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

  // create the new layer object

  // add the layer to the map

  if (showPopup) {
    map.on("click", layerId, (e) => {
      console.log("clicked");
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
