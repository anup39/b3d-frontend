import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as ExifReader from "exifreader";
import PropTypes from "prop-types";

const Dropzone = ({ handleFileData }) => {
  // const dispatch = useDispatch();

  // const files = useSelector((state) => state.inspectionUpload.files);
  // console.log(files, "files");
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles?.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");

        reader.onload = async () => {
          const arrayBuffer = reader.result;
          const tags = await ExifReader.load(arrayBuffer);
          // Create a new object with only the data you need
          const fileData = {
            name: file.name,
            size: file.size,
            file: file,
            latitude: tags.GPSLatitude.description,
            longitude: tags.GPSLongitude.description,
          };

          // Append newFileData to the fileData array
          handleFileData(fileData);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [handleFileData]
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
          <span>Choose Photos</span>
          <br />
          <span>/Drag and Drop</span>
        </p>
      )}
    </div>
  );
};

export default Dropzone;

Dropzone.propTypes = {
  handleFileData: PropTypes.func,
};
