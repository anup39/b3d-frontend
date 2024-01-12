import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef } from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import maplibregl from "maplibre-gl";
import { setshowMapLoader } from "../../reducers/MapView";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLayers } from "../../reducers/UploadMeasuring";

function getPopupHTML(properties) {
  let html = "";

  for (const [key, value] of Object.entries(properties)) {
    html += `<b>${key}:</b> ${value}<br> `;
  }
  return html;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2);
}

function getRandomHexColor() {
  // Generate a random integer between 0 and 16777215 (0xFFFFFF in decimal)
  const randomColor = Math.floor(Math.random() * 16777215);

  // Convert the decimal color to a hexadecimal string
  const hexColor = randomColor.toString(16);

  // Pad the hex string with zeros if necessary
  return "#" + "0".repeat(6 - hexColor.length) + hexColor;
}

export default function InputShapefileUpload({
  onFileUpload,
  onProjection,
  onFileName,
  onSetFilesize,
  onDoneLoaded,
  onImage,
  projection,
  fileName,
  filesize,
  image,
  loaded,
}) {
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    onDoneLoaded(false);
    onImage();
    RemoveSourceAndLayerFromMap({
      map: window.mapshapefile,
      layerId: "geojson-layer",
      sourceId: "geojson-source",
    });
    const file = e.target.files[0];
    console.log(file, "file");

    onFileUpload(file);
    onDoneLoaded(true);
    onFileName(file.name);
    const file_size = bytesToMB(file.size);
    onSetFilesize(file_size + " " + "MB");
    onProjection(`EPSG:${4326}`);

    const map = window.mapshapefile;

    dispatch(setshowMapLoader(true));
    axios.get("http://137.135.165.161:8000/api/upload-geojson/").then((res) => {
      dispatch(setLayers(res.data.layers));
      dispatch(setshowMapLoader(false));

      res.data.result.map((layer, index) => {
        map.addSource(`${layer.layername}`, {
          type: "geojson",
          data: layer.geojson,
        });
        //   // Add layers for different feature types

        map.addLayer({
          id: `line-${layer.layername}`,
          type: "line",
          source: `${layer.layername}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "coalesce", // Use the first non-null value
              ["get", "fill"], // Try to get the "fill" property
              getRandomHexColor(), // Use a random color if "fill" is not present
            ],
            "line-width": 2,
          },
          filter: ["==", "$type", "LineString"],
        });

        map.addLayer({
          id: `polygon-${layer.layername}`,
          type: "fill",
          source: `${layer.layername}`,
          paint: {
            "fill-color": [
              "coalesce", // Use the first non-null value
              ["get", "fill"], // Try to get the "fill" property
              getRandomHexColor(), // Use a random color if "fill" is not present
            ],
            "fill-opacity": 0.6,
            "fill-outline-color": "black",
          },
          filter: ["==", "$type", "Polygon"],
        });

        map.addLayer({
          id: `circle-${layer.layername}`,
          type: "circle",
          source: `${layer.layername}`,
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "coalesce", // Use the first non-null value
              ["get", "marker-color"], // Try to get the "fill" property
              getRandomHexColor(), // Use a random color if "fill" is not present
            ],
          },
          filter: ["==", "$type", "Point"],
        });
        // map.on("click", function (e) {
        //   var features = map.queryRenderedFeatures(e.point, {
        //     layers: [
        //       `line-layer-${index}`,
        //       `polygon-layer-${index}`,
        //       `circle-layer-${index}`,
        //     ],
        //   });

        //   if (!features.length) {
        //     return;
        //   }

        //   var feature = features[0];

        //   var popup = new maplibregl.Popup()
        //     .setLngLat(e.lngLat)
        //     .setHTML(getPopupHTML(feature.properties))
        //     .addTo(map);
        // });
        // map.on("mousemove", function (e) {
        //   var features = map.queryRenderedFeatures(e.point, {
        //     layers: [
        //       `line-layer-${index}`,
        //       `polygon-layer-${index}`,
        //       `circle-layer-${index}`,
        //     ],
        //   });
        //   map.getCanvas().style.cursor = features.length ? "pointer" : "";
        // });
        // const extent = turf.bbox(output);
        window.mapshapefile.fitBounds(layer.extent, {
          padding: { top: 15, bottom: 30, left: 15, right: 5 },
        });
        // Add popups to features

        map.on("click", function (e) {
          const features = map.queryRenderedFeatures(e.point);

          if (!features.length) {
            return;
          }

          var feature = features[0];

          const popups = document.getElementsByClassName("maplibregl-popup");

          if (popups.length) {
            popups[0].remove();
          }

          var popup = new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(getPopupHTML(feature.properties))
            .addTo(map);
        });

        // map.on("mousemove", function (e) {
        //   var features = map.queryRenderedFeatures(e.point, {
        //     layers: [
        //       `circle-${layer.layername}`,
        //       `polygon-${layer.layername}`,
        //       `line-${layer.layername}`,
        //     ],
        //   });
        //   map.getCanvas().style.cursor = features.length ? "pointer" : "";
        // });
      });
    });
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          <b>Supported EPSG</b> : 4326, 3578
        </Typography>
        <p style={{ color: "red" }}>Contact for other projections.</p>
        <Typography variant="body2" gutterBottom>
          <b>Acceptable Files</b> : .zip , .geojson
        </Typography>
      </Grid>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload Shapefile or Geojson File
        <VisuallyHiddenInput
          type="file"
          accept=".zip , .json,.shp"
          ref={fileInputRef}
          onChange={handleFileChange}
          required
        />
      </Button>
      <Grid item xs={12}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ fontSize: "12px" }} variant="body2" gutterBottom>
              <b>FileName</b> : {fileName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <b>FileSize</b> : {filesize}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <b>Projection</b>: {projection}
            </Typography>
          </div>
        </div>
      </Grid>
    </div>
  );
}

InputShapefileUpload.propTypes = {
  onFileUpload: PropTypes.func,
  onProjection: PropTypes.func,
  onFileName: PropTypes.func,
  onDoneLoaded: PropTypes.func,
  onImage: PropTypes.func,
  onSetFilesize: PropTypes.func,
  projection: PropTypes.string,
  fileName: PropTypes.string,
  filesize: PropTypes.string,
  image: PropTypes.string,
  loaded: PropTypes.bool,
};
