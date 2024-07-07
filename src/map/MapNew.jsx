import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

export default function MapNew() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [-127.6476, 53.7267],
      zoom: 4,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  return <div ref={mapContainer} className="h-[100%]" />;
}
