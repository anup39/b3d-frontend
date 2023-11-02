import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import RasterCard from "../RasterCard/RasterCard";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RasterContainer({ id }) {
  const navigate = useNavigate();
  const [rasters, setRasters] = useState([]);

  const handleOpenMap = () => {
    navigate(`/map/${id}`);
  };

  const fetchData = (id) => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=${id}`
      )
      .then((res) => {
        setRasters(res.data);
      });
  };

  useEffect(() => {
    fetchData(id);

    const interval = setInterval(() => {
      fetchData(id);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div>
      {rasters.length > 0 ? (
        <Button
          style={{ left: "50%" }}
          onClick={handleOpenMap}
          variant="contained"
          color="success"
        >
          Open Map
        </Button>
      ) : null}

      {rasters
        ? rasters.map((raster) => (
            <RasterCard
              key={raster.id}
              id={raster.id}
              name={raster.name}
              status={raster.status}
              file_size={raster.file_size}
              progress={raster.progress}
              created_on={raster.created_on}
              task_id={raster.task_id}
              file_name={raster.file_name}
              projection={raster.projection}
              thubnail={raster.screenshot_image}
            />
          ))
        : null}
    </div>
  );
}

RasterContainer.propTypes = {
  id: PropTypes.string,
};
