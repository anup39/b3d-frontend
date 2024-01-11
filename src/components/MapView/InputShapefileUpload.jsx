import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { takeScreenshot } from "../../maputils/createMapImage";
import { SHPLoader } from "@loaders.gl/shapefile";
import { load } from "@loaders.gl/core";
import { JSONLoader } from "@loaders.gl/json";
import * as turf from "@turf/turf";
import maplibregl from "maplibre-gl";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [openrasterErrorToast, setOpenrasterErrorToast] = useState(false);
  const [openrasterErrorMessage, setOpenrasterErrorMessage] = useState("");

  // useEffect(() => {
  //   if (loaded) {
  //     takeScreenshot(window.mapproperty).then(function (data) {
  //       onImage(data);
  //     });
  //   }
  // }, [loaded, onImage]);

  const handleFileChange = async (e) => {
    setOpenrasterErrorToast(false);
    onDoneLoaded(false);
    onImage();
    RemoveSourceAndLayerFromMap({
      map: window.mapshapefile,
      layerId: "geojson-layer",
      sourceId: "geojson-source",
    });
    const file = e.target.files[0];
    const data = await load(file, JSONLoader); // Assuming 'load' and 'SHPLoader' are defined elsewhere
    // const data = await load(file, SHPLoader); // Assuming 'load' and 'SHPLoader' are defined elsewhere

    console.log(data, "data");
    console.log(file, "file");
    onFileUpload(file);
    onDoneLoaded(true);
    onFileName(file.name);
    const file_size = bytesToMB(file.size);
    onSetFilesize(file_size + " " + "MB");
    onProjection(`EPSG:${4326}`);

    const map = window.mapshapefile;

    if (data) {
      map.addSource("geojson-data", {
        type: "geojson",
        data: data,
      });

      // Add layers for different feature types
      // map.addLayer({
      //   id: "line-layer",
      //   type: "line",
      //   source: "geojson-data",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": ["get", "stroke"],
      //     "line-width": 2,
      //   },
      //   filter: ["==", "$type", "LineString"],
      // });

      // map.addLayer({
      //   id: "polygon-layer",
      //   type: "fill",
      //   source: "geojson-data",
      //   paint: {
      //     "fill-color": ["get", "fill"],
      //     "fill-opacity": 0.6,
      //     "fill-outline-color": ["get", "stroke"],
      //   },
      //   filter: ["==", "$type", "Polygon"],
      // });

      map.addLayer({
        id: "circle-layer",
        type: "circle",
        source: "geojson-data",
        paint: {
          "circle-radius": 6,
          // "circle-color": ["get", "fill"],
          "circle-color": "blue",
        },
        // filter: ["==", "$type", "Point"],
      });

      // Add popups to features
      map.on("click", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["circle-layer"],
        });

        if (!features.length) {
          return;
        }

        var feature = features[0];

        var popup = new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(getPopupHTML(feature.properties))
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over a feature
      map.on("mousemove", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["line-layer", "polygon-layer", "circle-layer"],
        });
        map.getCanvas().style.cursor = features.length ? "pointer" : "";
      });
      const extent = turf.bbox(data);
      window.mapshapefile.fitBounds(extent);
      // Calculate the extent
    } else {
      setOpenrasterErrorToast(true);
      setOpenrasterErrorMessage("Please select a tiff file.");
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openrasterErrorToast}
        autoHideDuration={3000}
        message="Failed to Upload Geotif"
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {openrasterErrorMessage}
        </Alert>
      </Snackbar>
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
