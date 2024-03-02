import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as ExifReader from "exifreader";
import maplibregl from "maplibre-gl";
import PropTypes from "prop-types";

const Dropzone = ({ handleFileData, map, files }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      let lastFileTags;
      acceptedFiles?.forEach((file, index) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          const arrayBuffer = reader.result;
          const tags = await ExifReader.load(arrayBuffer);
          const fileData = {
            name: file.name,
            size: file.size,
            file: file,
            latitude: tags.GPSLatitude.description,
            longitude: tags.GPSLongitude.description,
            checked: false,
          };
          map.addLayer({
            id: `point-${files.length + index}`,
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    tags.GPSLongitude.description,
                    tags.GPSLatitude.description,
                  ],
                },
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#007cbf",
            },
          });
          handleFileData(fileData);

          // Save the tags of the last file
          if (index === acceptedFiles.length - 1) {
            map.flyTo({
              center: [
                tags.GPSLongitude.description,
                tags.GPSLatitude.description,
              ],
              zoom: 20,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [handleFileData, map, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        height: "40px",
        backgroundColor: "#027FFE",
        cursor: "pointer",
        borderRadius: "5px",
        color: "#FFFFFF",
        padding: "4px",
        paddingLeft: "40px",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>
          <span>Choose Photos OR</span>
          <br />
          <span>Drag and Drop</span>
        </p>
      )}
    </div>
  );
};

export default Dropzone;

Dropzone.propTypes = {
  handleFileData: PropTypes.func,
  map: PropTypes.object,
  files: PropTypes.array,
};
