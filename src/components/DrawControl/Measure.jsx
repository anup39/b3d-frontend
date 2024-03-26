import StraightenIcon from "@mui/icons-material/Straighten";
import { IconButton, Tooltip } from "@mui/material";
import * as turf from "@turf/turf";
import "./measure.css";
import maplibregl from "maplibre-gl";
import { useState } from "react";

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

function handleMeasureEvent(e) {
  const popup_custom = document.getElementById("popup-custom");
  if (popup_custom) {
    // popup_custom.style.display = "none";
    popup_custom.remove();
  }
  const map = window.map_global;
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
}

export default function Measure({ popUpRef }) {
  const [checked, setChecked] = useState(false);

  const handleMeasure = () => {
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    popUpRef.current.remove();

    geojson.features = [];
    linestring.geometry.coordinates = [];
    setChecked(!checked);

    const map = window.map_global;

    // GeoJSON object to hold our measurement features

    if (!checked) {
      map.getCanvas().style.cursor = "crosshair";
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

      map.on("click", handleMeasureEvent);
    } else {
      if (map.getLayer("measure-points")) {
        map.removeLayer("measure-points");
      }
      if (map.getLayer("measure-lines")) {
        map.removeLayer("measure-lines");
      }
      if (map.getSource("geojson")) {
        map.removeSource("geojson");
      }
      const popups = document.getElementsByClassName("maplibregl-popup");
      if (popups.length) {
        popups[0].remove();
      }
      map.getCanvas().style.cursor = "pointer";
      map.off("click", handleMeasureEvent);
    }
  };
  return (
    <div>
      <Tooltip title="Measure">
        <IconButton
          onClick={handleMeasure}
          //   id="cancel-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: checked ? "blue" : "#d61b60",
          }}
          aria-label="Measure"
        >
          <StraightenIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

// Path: src/components/DrawControl/Measure.jsx
