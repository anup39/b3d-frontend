import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
export default function Map() {
  const mapContainer = useRef(null);
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`, // stylesheet location
      center: [103.8574, 2.2739], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} id="map" className="map" />;
}
