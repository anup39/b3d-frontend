import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import RasterCard from "../RasterCard/RasterCard";

export default function RasterContainer({ id }) {
  const [rasters, setRasters] = useState([]);

  const fetchData = (id) => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/raster-data/?project=1`)
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
