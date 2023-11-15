import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RasterLayer({ map, project_id }) {
  const [orthophotos, setOrthophotos] = useState([]);

  function handleCheckboxChange(id, name, checked) {
    if (checked) {
      axios
        .get(`${import.meta.env.VITE_API_RASTER_URL}/bounds/${id}`)
        .then((res) => {
          if (res.data.bounds) {
            const bounds = res.data.bounds;
            map.fitBounds(bounds);
            map.addSource(`${id}-source`, {
              type: "raster",
              tiles: [
                `${
                  import.meta.env.VITE_API_RASTER_URL
                }/tile-async/${id}/{z}/{x}/{y}.png?r=red&g=green&b=blue&tile_size=[512,512]&r_range=[0,255]&g_range=[0,255]&b_range=[0,255]&bounds=[${
                  bounds[0]
                },${bounds[1]},${bounds[2]},${bounds[3]}]`,
              ],
              tileSize: 512,
            });

            map.addLayer({
              id: `${id}-layer`,
              type: "raster",
              source: `${id}-source`,
              minzoom: 0,
              maxzoom: 24,
            });
            map.moveLayer(`${id}-layer`, "gl-draw-polygon-fill-inactive.cold");
          }
        })
        .catch(() => {});
    } else {
      const style = map.getStyle();
      const existingLayer = style.layers.find(
        (layer) => layer.id === `${id}-layer`
      );
      const existingSource = style.sources[`${id}-source`];
      if (existingLayer) {
        map.off("click", `${id}-layer`);
        map.removeLayer(`${id}-layer`);
      }
      if (existingSource) {
        map.removeSource(`${id}-source`);
      }
    }
  }
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/raster-data/?client=${project_id}&is_display=true`
      )
      .then((res) => {
        setOrthophotos(res.data);
      });
  }, [project_id]);

  return (
    <div>
      <h2>Orthophotos</h2>
      <ul>
        {orthophotos.map((ortho) => {
          return (
            <li
              key={ortho.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="checkbox"
                id={`item${ortho.id}`}
                style={{ marginRight: "8px", cursor: "pointer" }}
                onChange={(e) =>
                  handleCheckboxChange(ortho.id, ortho.name, e.target.checked)
                }
              />
              <label htmlFor={`item${ortho.id}`}>{ortho.name}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

RasterLayer.propTypes = {
  map: PropTypes.object,
  project_id: PropTypes.string,
};
