/// app.js
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import Map from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import PropTypes from "prop-types";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";

// Set your mapbox access token here
const MAPTILER_TOKEN = import.meta.env.VITE_MAPTILER_TOKEN;

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -107.88857386093643,
  latitude: 38.98669825130578,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};
const MAP_STYLE = `https://api.maptiler.com/maps/satellite/style.json?key=${
  import.meta.env.VITE_MAPTILER_TOKEN
}`;
// Data to be used by the LineLayer

export default function Mapgl() {
  const bounds = [
    -107.88857386093643, 38.98669825130578, -107.8871274949119,
    38.9877213739204,
  ];
  const ortho_id = 31;
  const layer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: `${
      import.meta.env.VITE_API_RASTER_URL
    }/tile-async/${ortho_id}/{z}/{x}/{y}.png?r=red&g=green&b=blue&tile_size=[512,512]&r_range=[0,255]&g_range=[0,255]&b_range=[0,255]&bounds=[${
      bounds[0]
    },${bounds[1]},${bounds[2]},${bounds[3]}]`,

    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={[]}>
      <Map
        mapLib={maplibregl}
        mapStyle={MAP_STYLE}
        reuseMaps
        preventStyleDiffing={true}
      />
    </DeckGL>
  );
}

Mapgl.propTypes = {
  data: PropTypes.array,
};
