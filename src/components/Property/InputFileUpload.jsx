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

// Checking the Issues here

// import GeoTIFF, { fromUrl, fromUrls, fromBlob } from "geotiff";
// import { fromArrayBuffer } from "geotiff";
// import proj4 from "proj4";
// import epsgDefinitions from "../../maputils/epsgcodes";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export default function InputFileUpload({
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

  useEffect(() => {
    if (loaded) {
      takeScreenshot(window.mapproperty).then(function (data) {
        onImage(data);
      });
    }
  }, [loaded, onImage]);

  const handleFileChange = async (e) => {
    setOpenrasterErrorToast(false);
    onDoneLoaded(false);
    onImage();
    RemoveSourceAndLayerFromMap({
      map: window.mapproperty,
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

    if (file && file.type === "image/tiff") {
      const reader = new FileReader();
      console.log(reader, "reader");

      // #Here is some issue i didnot get , the extent is the zomming the Map

      // reader.onload = async (e) => {
      //   const arrayBuffer = e.target.result;
      //   try {
      //     const tiff = await fromArrayBuffer(arrayBuffer);
      //     const image_raster = await tiff.getImage();
      //     //   const data = await image.readRasters();
      //     const bbox = image_raster.getBoundingBox();
      //     const geo_Keys = image_raster.geoKeys;
      //     console.log(geo_Keys, "geokeys");
      //     const source_bbox = {
      //       southwest: [bbox[0], bbox[1]],
      //       northeast: [bbox[2], bbox[3]],
      //     };
      //     const source_epsg = geo_Keys.ProjectedCSTypeGeoKey;

      //     if (epsgDefinitions.hasOwnProperty(source_epsg)) {
      //       proj4.defs(`EPSG:${source_epsg}`, epsgDefinitions[source_epsg]);
      //       proj4.defs("EPSG:4326", epsgDefinitions[4326]);
      //       const bboxInEPSG4326 = {
      //         southwest: proj4(
      //           `EPSG:${source_epsg}`,
      //           "EPSG:4326",
      //           source_bbox.southwest
      //         ),
      //         northeast: proj4(
      //           `EPSG:${source_epsg}`,
      //           "EPSG:4326",
      //           source_bbox.northeast
      //         ),
      //       };

      //       const bbox_reprojected = [
      //         bboxInEPSG4326.northeast[0],
      //         bboxInEPSG4326.northeast[1],
      //         bboxInEPSG4326.southwest[0],
      //         bboxInEPSG4326.southwest[1],
      //       ];

      //       const geoJSONPolygon = {
      //         type: "Feature",
      //         geometry: {
      //           type: "Polygon",
      //           coordinates: [
      //             [
      //               [bbox_reprojected[0], bbox_reprojected[1]],
      //               [bbox_reprojected[2], bbox_reprojected[1]],
      //               [bbox_reprojected[2], bbox_reprojected[3]],
      //               [bbox_reprojected[0], bbox_reprojected[3]],
      //               [bbox_reprojected[0], bbox_reprojected[1]],
      //             ],
      //           ],
      //         },
      //         properties: {},
      //       };
      //       window.mapproperty.addSource("geojson-source", {
      //         type: "geojson",
      //         data: geoJSONPolygon,
      //       });

      //       window.mapproperty.addLayer({
      //         id: "geojson-layer",
      //         type: "line",
      //         source: "geojson-source",
      //         layout: {},
      //         paint: {
      //           "line-color": "red",
      //           "line-opacity": 1,
      //         },
      //       });

      //       window.mapproperty.fitBounds(bbox_reprojected);
      //       window.mapproperty.on("moveend", function () {
      //         onDoneLoaded(true);
      //       });
      //     } else {
      //       setOpenrasterErrorToast(true);
      //       setOpenrasterErrorMessage(`${source_epsg} cannot be uploaded.`);
      //     }

      //     onFileName(file.name);
      //     const file_size = bytesToMB(file.size);
      //     onSetFilesize(file_size + " " + "MB");
      //     onProjection(`EPSG:${source_epsg}`);

      //     if (onFileUpload) {
      //       onFileUpload(file);
      //     }
      //   } catch (error) {
      //     setOpenrasterErrorToast(true);
      //     setOpenrasterErrorMessage("Please select a valid GeoTIFF file.");
      //   }
      // };
      // reader.readAsArrayBuffer(file);
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
          <b>Supported EPSG</b> : 4326, 32613 , 25832
        </Typography>
        <p style={{ color: "red" }}>Contact for other projections.</p>
        <Typography variant="body2" gutterBottom>
          <b>Acceptable Files</b> : .tif , .tiff
        </Typography>
        <p style={{ color: "red" }}>True color (RBG) Band</p>
      </Grid>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload Tif File
        <VisuallyHiddenInput
          type="file"
          accept=".tif, .tiff"
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
            <div>
              {image ? (
                <>
                  <Typography variant="body2" gutterBottom>
                    <b>Generated Thumbnail</b> :
                  </Typography>
                  <img
                    style={{ height: "75px", width: "125px" }}
                    id="screenshot-img"
                    src={image ? image : ""}
                    alt="Map Screenshot"
                  ></img>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
}

InputFileUpload.propTypes = {
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
