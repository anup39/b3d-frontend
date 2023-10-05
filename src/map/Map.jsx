import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.scss";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import GeocoderApi from "../maputils/GeocoderApi";
import PropTypes from "prop-types";
import LayersControl from "../components/LayerControl/LayerControl";
import DrawControl from "../components/DrawControl/DrawControl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDispatch } from "react-redux";
import { setWKTGeometry } from "../reducers/DrawnPolygon";

export default function Map({ refObj, project_id }) {
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [103.8574, 2.2739],
      zoom: 10,
    });

    window.map_global = map;
    setMap(map);
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.on("load", () => {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });

        // 1 Draw and its layer
        map.addControl(draw);
        map.draw = draw;

        document
          .getElementById("polygon-box")
          .addEventListener("click", function () {
            draw.deleteAll();
            draw.changeMode("draw_polygon");
          });

        // Other layers are added here
        map.on("draw.create", function (event) {
          // dispatch(setPriceLayers({ id: 1, checked: false }));
          const feature = event.features; // Array of newly created features
          const geometry = feature[0].geometry;
          const coordinates = geometry.coordinates[0];
          const wktCoordinates = coordinates
            .map((coord) => `${coord[0]} ${coord[1]}`)
            .join(", ");
          const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
          console.log(wktCoordinates_final, "wkt geom");
          dispatch(setWKTGeometry(wktCoordinates_final));
        });
        map.on("draw.update", function (event) {
          // dispatch(setPriceLayers({ id: 1, checked: false }));
          const feature = event.features; // Array of newly created features
          const geometry = feature[0].geometry;
          const coordinates = geometry.coordinates[0];
          const wktCoordinates = coordinates
            .map((coord) => `${coord[0]} ${coord[1]}`)
            .join(", ");
          const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
          console.log(wktCoordinates_final, "wkt geom");
          dispatch(setWKTGeometry(wktCoordinates_final));
        });
      });
    }
  }, [map]);

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

  useEffect(() => {
    if (map) {
      const layer_control = new LayersControl();
      map.addControl(layer_control, "top-left");
      layer_control.updateProject(project_id);
      map.addControl(new DrawControl(), "top-left");
    }
  }, [map, project_id]);

  return <div ref={mapContainer} id="map" className="map" />;
}

Map.propTypes = {
  refObj: PropTypes.object,
  project_id: PropTypes.string,
};
