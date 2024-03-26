import StraightenIcon from "@mui/icons-material/Straighten";
import { IconButton, Tooltip } from "@mui/material";
import * as turf from "@turf/turf";
import { useState } from "react";
import maplibregl from "maplibre-gl";
import "./measure.css";

export default function Measure() {
  const [distance, setDistance] = useState(0);

  const handleMeasure = () => {
    const map = window.map_global;

    // GeoJSON object to hold our measurement features
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    // Used to draw a line between points
    const linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    };

    // map.on("load", () => {
    map.addSource("geojson", {
      type: "geojson",
      data: geojson,
    });

    // Add styles to the map
    map.addLayer({
      id: "measure-points",
      type: "circle",
      source: "geojson",
      paint: {
        "circle-radius": 5,
        "circle-color": "red",
      },
      filter: ["in", "$type", "Point"],
    });
    map.addLayer({
      id: "measure-lines",
      type: "line",
      source: "geojson",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 2.5,
      },
      filter: ["in", "$type", "LineString"],
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["measure-points"],
      });

      // Remove the linestring from the group
      // so we can redraw it based on the points collection.
      if (geojson.features.length > 1) geojson.features.pop();

      // Clear the distance container to populate it with a new value.

      // If a feature was clicked, remove it from the map.
      if (features.length) {
        const id = features[0].properties.id;
        geojson.features = geojson.features.filter(
          (point) => point.properties.id !== id
        );
      } else {
        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          },
          properties: {
            id: String(new Date().getTime()),
          },
        };

        geojson.features.push(point);
      }

      if (geojson.features.length > 1) {
        linestring.geometry.coordinates = geojson.features.map(
          (point) => point.geometry.coordinates
        );

        geojson.features.push(linestring);

        // Populate the distanceContainer with total distance
        const distance = turf.length(linestring);
        setDistance(`${distance.toFixed(2).toLocaleString()} km`);
        // console.log(map, "map");

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .addTo(map)
          .setHTML(
            `<div id="measure-popup">${distance
              .toFixed(2)
              .toLocaleString()}km </div>`
          );
      }

      map.getSource("geojson").setData(geojson);
    });
    // });

    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["measure-points"],
      });
      // Change the cursor to a pointer when hovering over a point on the map.
      // Otherwise cursor is a crosshair.
      map.getCanvas().style.cursor = features.length ? "pointer" : "crosshair";
    });
  };
  return (
    <div>
      <Tooltip title="Measure">
        <IconButton
          onClick={handleMeasure}
          id="cancel-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Measure"
        >
          <StraightenIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
