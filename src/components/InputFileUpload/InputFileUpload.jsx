import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from "geotiff";
import PropTypes from "prop-types";

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

export default function InputFileUpload({ onFileUpload }) {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/tiff") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const tiff = await fromArrayBuffer(arrayBuffer);
          console.log("Valid GeoTIFF");
          const image = await tiff.getImage();
          //   console.log(image, "image");
          //   const data = await image.readRasters();
          //   console.log(data, "data");
          const bbox = image.getBoundingBox();
          console.log(bbox, "bbox");

          setFileName(file.name);

          console.log(file, "file");

          if (onFileUpload) {
            onFileUpload(file);
          }
        } catch (error) {
          console.error("Not a valid GeoTIFF:", error);
          alert("Please select a valid GeoTIFF file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please select a TIFF file.");
    }
  };

  return (
    <div>
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
        <Typography variant="body2" gutterBottom>
          {fileName}
        </Typography>
      </Grid>
    </div>
  );
}

InputFileUpload.propTypes = {
  onFileUpload: PropTypes.func,
};
