import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.scss";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import GeocoderApi from "../maputils/GeocoderApi";
import PropTypes from "prop-types";

export default function Map({ refObj }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`, // stylesheet location
      center: [103.8574, 2.2739], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });

    window.map_global = map;
    setMap(map);

    // Add zoom and rotation controls to the map.
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      const geocoder = new MaplibreGeocoder(GeocoderApi, {
        maplibregl: maplibregl,
        showResultsWhileTyping: true,
        flyTo: true,
      });

      geocoder.addTo(refObj.current);
      geocoder.on("result", function (ev) {
        const coords = ev.result.geometry.coordinates;
        map.flyTo({ center: coords });
      });
    }
  }, [map, refObj]);

  return <div ref={mapContainer} id="map" className="map" />;
}

Map.propTypes = {
  refObj: PropTypes.object,
};
