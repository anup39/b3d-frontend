import React, { useState } from "react";
import { SHPLoader } from "@loaders.gl/shapefile";
import { load } from "@loaders.gl/core";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    // Log file details to console after upload
    console.log("Uploaded File:", uploadedFile);

    const data = await load(uploadedFile, SHPLoader); // Assuming 'load' and 'SHPLoader' are defined elsewhere

    console.log(data, "data");
    // Ensure the 'handleFileUpload' function is within an asynchronous context to use 'await'
  };
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {file && <p>File uploaded: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
