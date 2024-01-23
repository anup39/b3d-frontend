import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { setFile, setFiles } from '../../reducers/InspectionUpload';
import { useDispatch, useSelector } from 'react-redux';

const Dropzone = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.inspectionUpload.files);
  // console.log(files, "files");
  const onDrop = useCallback((acceptedFiles) => {
    // console.log(acceptedFiles, "acceptedFiles");

    acceptedFiles?.forEach((file) => {
      // console.log("🚀 ~ acceptedFiles?.forEach ~ file:", file);

      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const arrayBuffer = reader.result;
        console.log(arrayBuffer, 'reader.result');
        dispatch(setFile({ name: file.name, file: file }));
      };
      reader.readAsArrayBuffer(file);
    });

    // Todo : Things left to do
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        height: '40px',
        backgroundColor: '#027FFE',
        cursor: 'pointer',
        borderRadius: '5px',
        color: '#FFFFFF',
        padding: '4px',
        paddingLeft: '40px',
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
