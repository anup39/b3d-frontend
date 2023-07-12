import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.scss";

export default function Map() {
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

  return <div ref={mapContainer} id="map" className="map" />;
}
