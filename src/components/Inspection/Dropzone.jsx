import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { setFile, setFiles } from "../../reducers/InspectionUpload";
import { useDispatch, useSelector } from "react-redux";
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
          console.log(tags, "tags");
          console.log(arrayBuffer, "reader.result");

          // Create a new object with only the data you need
          const fileData = {
            name: file.name,
            size: file.size,
            file: file,
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
