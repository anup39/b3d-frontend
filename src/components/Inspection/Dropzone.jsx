import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles, 'acceptedFiles');

    acceptedFiles?.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const arrayBuffer = reader.result;
        console.log(arrayBuffer, 'reader.result');
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
