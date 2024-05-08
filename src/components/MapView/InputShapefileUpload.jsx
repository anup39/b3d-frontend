import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef } from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import RemoveSourceAndLayerFromMap from "../../maputils/RemoveSourceAndLayerFromMap";
import maplibregl from "maplibre-gl";
import { setshowMapLoader } from "../../reducers/MapView";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCurrentFile, setLayers } from "../../reducers/UploadMeasuring";
import { useTranslation } from "react-i18next";

function getPopupHTML(properties) {
  let html = "";
  for (const [key, value] of Object.entries(properties)) {
    html += `<b>${key}:</b> ${value}<br> `;
  }
  return html;
}

function removeLayersAndSources(map) {
  const mapStyle = map.getStyle();

  if (mapStyle && mapStyle.layers) {
    const pattern = /(line|polygon|circle)/;
    mapStyle.layers.forEach((layer) => {
      if (pattern.test(layer.id)) {
        const sourceId = layer.source;
        map.removeLayer(layer.id);

        // Check if other layers are using the same source
        const layersWithSameSource = mapStyle.layers.filter(
          (l) => l.source === sourceId
        );

        // Remove the associated source only if no other layers are using it
        if (layersWithSameSource.length === 0) {
          map.removeSource(sourceId);
        }
      }
    });
  }
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
  const randomColor = Math.floor(Math.random() * 16777215);
  const hexColor = randomColor.toString(16);
  return "#" + "0".repeat(6 - hexColor.length) + hexColor;
}

export default function InputShapefileUpload({
  fileName,
  filesize,
  setError,
  setLoaded,
  setUploadedFile,
  setFileName,
  setFilesize,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const map = window.mapshapefile;
    dispatch(setLayers([]));
    dispatch(setCurrentFile(null));
    removeLayersAndSources(map);
    setLoaded(false);
    setError("");
    RemoveSourceAndLayerFromMap({
      map: map,
      layerId: "geojson-layer",
      sourceId: "geojson-source",
    });
    const file = e.target.files[0];
    setUploadedFile(file);
    setLoaded(true);
    setFileName(file.name);
    const file_size = bytesToMB(file.size);
    setFilesize(file_size + " " + "MB");
    dispatch(setshowMapLoader(true));
    const fileextension = file.name.split(".").pop();
    let type_of_file = "Geojson";
    if (fileextension === "zip") {
      type_of_file = "Shapefile";
    } else if (fileextension === "geojson" || fileextension === "json") {
      type_of_file = "Geojson";
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type_of_file", type_of_file);

    axios
      .post("http://137.135.165.161:8000/api/upload-geojson/", formData)
      .then((res) => {
        dispatch(setLayers(res.data.layers));
        dispatch(setCurrentFile(res.data.file));
        dispatch(setshowMapLoader(false));
        res.data.result.map((layer) => {
          map.addSource(`${layer.layername}`, {
            type: "geojson",
            data: layer.geojson,
          });
          map.addLayer({
            id: `line-${layer.layername}`,
            type: "line",
            source: `${layer.layername}`,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": ["coalesce", ["get", "fill"], getRandomHexColor()],
              "line-width": 2,
            },
            filter: ["==", "$type", "LineString"],
          });

          map.addLayer({
            id: `polygon-${layer.layername}`,
            type: "fill",
            source: `${layer.layername}`,
            paint: {
              "fill-color": ["coalesce", ["get", "fill"], getRandomHexColor()],
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
                "coalesce",
                ["get", "marker-color"],
                getRandomHexColor(),
              ],
            },
            filter: ["==", "$type", "Point"],
          });
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
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(getPopupHTML(feature.properties))
              .addTo(map);
          });
        });
      })
      .catch(() => {
        setError("Failed to upload file.Please upload a valid file");
        setLoaded(false);
        dispatch(setLayers([]));
        dispatch(setCurrentFile(null));
        removeLayersAndSources(map);
        setLoaded(false);
        setUploadedFile(null);
        setFileName("");
        setFilesize("");
        dispatch(setshowMapLoader(false));
        // setLoading(false);
      });
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          <b>{t("Acceptable") + " " + t("Files")}</b> : .json,.geojson ,.zip
        </Typography>
      </Grid>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {t("Upload")} Shapefile or Geojson {t("File")}
        <VisuallyHiddenInput
          type="file"
          accept=".geojson, .json "
          ref={fileInputRef}
          onChange={handleFileChange}
          required
        />
      </Button>
      <Grid item xs={12}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ fontSize: "12px" }} variant="body2" gutterBottom>
              <b>{t("File") + " " + t("Name")}</b> : {fileName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <b>{t("File") + " " + t("Size")}</b> : {filesize}
            </Typography>
          </div>
        </div>
      </Grid>
    </div>
  );
}

InputShapefileUpload.propTypes = {
  fileName: PropTypes.string,
  filesize: PropTypes.string,
  setError: PropTypes.func,
  setLoaded: PropTypes.func,
  setUploadedFile: PropTypes.func,
  setFileName: PropTypes.func,
  setFilesize: PropTypes.func,
};
