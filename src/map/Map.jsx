import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.scss";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import PropTypes from "prop-types";
import LayersControl from "../components/LayerControl/LayerControl";
import DrawControl from "../components/DrawControl/DrawControl";
import RasterControl from "../components/RasterControl/RasterControl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDispatch } from "react-redux";
import { setWKTGeometry } from "../reducers/DrawnPolygon";
import {
  MaplibreExportControl,
  Size,
  PageOrientation,
  Format,
  DPI,
} from "@watergis/maplibre-gl-export";
import "@watergis/maplibre-gl-export/dist/maplibre-gl-export.css";

export default function Map({ id }) {
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

        map.on("draw.create", function (event) {
          const feature = event.features;
          const geometry = feature[0].geometry;
          const coordinates = geometry.coordinates[0];
          const wktCoordinates = coordinates
            .map((coord) => `${coord[0]} ${coord[1]}`)
            .join(", ");
          const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
          dispatch(setWKTGeometry(wktCoordinates_final));
        });
        map.on("draw.update", function (event) {
          const feature = event.features;
          const geometry = feature[0].geometry;
          const coordinates = geometry.coordinates[0];
          const wktCoordinates = coordinates
            .map((coord) => `${coord[0]} ${coord[1]}`)
            .join(", ");
          const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
          dispatch(setWKTGeometry(wktCoordinates_final));
        });
      });
    }
  }, [map, dispatch]);

  // useEffect(() => {
  //   if (map) {
  //     const geocoder = new MaplibreGeocoder(GeocoderApi, {
  //       maplibregl: maplibregl,
  //       showResultsWhileTyping: true,
  //       flyTo: true,
  //     });

  //     geocoder.addTo(refObj.current);
  //     geocoder.on("result", function (ev) {
  //       const coords = ev.result.geometry.coordinates;
  //       map.flyTo({ center: coords });
  //     });
  //   }
  // }, [map, refObj]);

  useEffect(() => {
    if (map) {
      const layer_control = new LayersControl();
      map.addControl(layer_control, "top-left");
      layer_control.updateProject(id);
      map.addControl(
        new MaplibreExportControl({
          PageSize: Size.A3,
          PageOrientation: PageOrientation.Portrait,
          Format: Format.PNG,
          DPI: DPI[96],
          Crosshair: true,
          PrintableArea: true,
        }),
        "top-right"
      );
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      const raster_control = new RasterControl();
      map.addControl(raster_control, "top-left");
      raster_control.updateProject(id);
      map.addControl(new DrawControl(), "top-right");
    }
  }, [map, id]);

  return <div ref={mapContainer} id="map" className="map" />;
}

Map.propTypes = {
  refObj: PropTypes.object,
  id: PropTypes.string,
};
