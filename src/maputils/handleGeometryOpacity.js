const setGeometryOpacity = (existingLayer, cat, map, layerId, value) => {
  if (existingLayer) {
    if (cat.type_of_geometry === "Polygon") {
      map.setPaintProperty(layerId, "fill-opacity", parseFloat(value));
    } else if (cat.type_of_geometry === "LineString") {
      map.setPaintProperty(layerId, "line-opacity", parseFloat(value));
    } else {
      map.setPaintProperty(layerId, "circle-opacity", parseFloat(value));
    }
  }
};

export default setGeometryOpacity;
