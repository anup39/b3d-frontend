import React, { useEffect, useState } from "react";
import { Rect } from "react-konva";
import axios from "axios";

const Rectangles = ({ imageId }) => {
  const [rectangles, setRectangles] = useState([]);

  useEffect(() => {
    const fetchRectangles = async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-photo-geometry/?inspection_photo=${imageId}`
      );
      console.log(res.data);
      setRectangles(res.data);
    };

    fetchRectangles();
  }, [imageId]);

  return rectangles.map((rect, i) => (
    <Rect
      x={(rect.x / 0.65) * 0.32}
      y={(rect.y / 0.6) * 0.32}
      width={(rect.width / 0.65) * 0.32}
      height={(rect.height / 0.6) * 0.32}
      scaleX={1}
      scaleY={1}
      fill={"transparent"}
      stroke={rect.stroke_color}
      strokeWidth={rect.stroke_width}
      name={rect.name}
      key={i}
    />
  ));
};

export default Rectangles;
