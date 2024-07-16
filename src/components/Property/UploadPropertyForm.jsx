import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { createImagePNG } from "../../maputils/createMapImage";
import {
  setshowTifUpload,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import {
  setProgress,
  setproperties,
  setshowProgressFormOpen,
} from "../../reducers/Property";
import InputFileUpload from "./InputFileUpload";
import maplibregl from "maplibre-gl";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import {
  useGetRasterDataByProjectIdQuery,
  useUploadRasterDataMutation,
} from "../../api/rasterDataApi";

export default function UploadPropertyForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapContainerProperty = useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [projection, setProjection] = useState("");
  const [fileName, setFileName] = useState("");
  const [filesize, setFilesize] = useState("");
  const [image, setImage] = useState();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);
  const [map, setMap] = useState(null);

  const [uploadRasterData] = useUploadRasterDataMutation();

  const client_id_property = useSelector(
    (state) => state.property.client_id_property
  );
  const project_id_property = useSelector(
    (state) => state.property.project_id_property
  );

  const { data: rasterDataByProjectId, refetch: refetchRasterDataByProjectId } =
    useGetRasterDataByProjectIdQuery(
      { project: client_id_property },
      { polingInterval: 1000 }
    );
  const closeForm = () => {
    dispatch(setshowTifUpload(false));
    setUploadedFile(null);
    setProjection("");
    setFileName("");
    setFilesize("");
    setImage();
    setLoaded(false);
  };
  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const onProjection = (value) => {
    setProjection(value);
  };

  const onFileName = (value) => {
    setFileName(value);
  };

  const onSetFilesize = (value) => {
    setFilesize(value);
  };

  const onDoneLoaded = (value) => {
    setLoaded(value);
  };

  const onImage = (value) => {
    setImage(value);
  };

  const handleCreateProperty = async (event) => {
    event.preventDefault();
    setLoading(true);

    const nameInput = document.getElementById("name");
    const blob_ = createImagePNG(image);
    const formData = new FormData();
    formData.append("client", client_id_property);
    formData.append("project", project_id_property);
    formData.append("name", nameInput.value);
    formData.append("status", "Uploaded");
    formData.append("screenshot_image", blob_, "image.png");
    formData.append("file_size", uploadedFile.size);
    formData.append("projection", projection);
    formData.append("file_name", fileName);
    formData.append("created_by", user_id);

    closeForm();

    dispatch(setshowProgressFormOpen(true));

    const CHUNK_SIZE = 1000000; // Size of chunks (1MB)
    const SIZE = uploadedFile.size;
    const CHUNKS_COUNT = Math.ceil(SIZE / CHUNK_SIZE);
    let currentChunk = 1;

    // Generate a UUID
    const uuid = uuidv4();

    try {
      for (let i = 0; i < CHUNKS_COUNT; i++) {
        const start = i * CHUNK_SIZE;
        const end = (i + 1) * CHUNK_SIZE < SIZE ? (i + 1) * CHUNK_SIZE : SIZE;
        const chunk = uploadedFile.slice(start, end);

        const chunkFormData = new FormData();
        chunkFormData.append("tif_file", chunk);
        chunkFormData.append("chunk_number", currentChunk++);
        chunkFormData.append("total_chunks", CHUNKS_COUNT);
        chunkFormData.append("uuid", uuid);
        chunkFormData.append("client", client_id_property);
        chunkFormData.append("project", project_id_property);
        chunkFormData.append("name", nameInput.value);
        chunkFormData.append("status", "Uploaded");
        chunkFormData.append("screenshot_image", blob_, "image.png");
        chunkFormData.append("file_size", uploadedFile.size);
        chunkFormData.append("projection", projection);
        chunkFormData.append("file_name", fileName);
        chunkFormData.append("created_by", user_id);

        try {
          await uploadRasterData({
            data: formData,
            onUploadProgress: (event) => {
              const percentCompleted = Math.round(
                (currentChunk / CHUNKS_COUNT) * 100
              );
              dispatch(setProgress(percentCompleted));
            },
          });
          console.log("Upload successful");
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      // After all chunks uploaded
      dispatch(setshowProgressFormOpen(false));
      dispatch(setProgress(0));
      setLoading(false);
      dispatch(setshowToast(true));
      dispatch(
        settoastMessage(
          `${t("Successfully")}  ${t("Created")} ${t("Property")} ${t("Map")}  `
        )
      );
      dispatch(settoastType("success"));
      closeForm();
      refetchRasterDataByProjectId().then((res) => {
        dispatch(setproperties(res.data));
      });
    } catch (error) {
      setLoading(false);
      dispatch(setshowToast(true));
      dispatch(
        settoastMessage(
          `${t("Failed")}  ${t("To")} ${t("Create")} ${t("Property")}  ${t(
            "Map"
          )} `
        )
      );
      dispatch(settoastType("error"));
      closeForm();
    }
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerProperty.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      center: [-107.88716767483929, 38.98772137493235],
      zoom: 10,
      attributionControl: false,
    });

    window.mapproperty = map;
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <form
        onSubmit={handleCreateProperty}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          background: "#fff",
          padding: "20px",
          zIndex: 10000,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label={t("Name")}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputFileUpload
              map={map}
              // mapref={mapContainerProperty}
              fileName={fileName}
              filesize={filesize}
              projection={projection}
              onFileUpload={handleFileUpload}
              onProjection={onProjection}
              onDoneLoaded={onDoneLoaded}
              onImage={onImage}
              onFileName={onFileName}
              onSetFilesize={onSetFilesize}
              image={image}
              loaded={loaded}
            />
            <Grid item>
              <div
                style={{ width: "100%", height: "160px" }}
                ref={mapContainerProperty}
                id="mapproperty"
                className="mapproperty"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant={loading ? "outlined" : "contained"}
              sx={{ mt: 0, mb: 0 }}
              disabled={!loaded}
            >
              {loading ? null : `${t("Add")}  ${t("Property")} ${t("Map")}`}
              {loading ? <CircularProgress /> : null}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={closeForm}
              variant="contained"
              color="error"
              size="small"
              fullWidth
            >
              {t("Close")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

UploadPropertyForm.propTypes = {
  client_id: PropTypes.string,
  project_id: PropTypes.string,
};
