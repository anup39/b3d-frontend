const RemoveSourceAndLayerFromMap = (map, layerId, sourceId) => {
  const style = map.getStyle();
  const existingLayer = style.layers.find((layer) => layer.id === layerId);
  const existingSource = style.sources[sourceId];

  if (existingLayer) {
    // remove the layer from the map
    map.off("click", layerId);
    map.removeLayer(layerId);
  }

  if (existingSource) {
    // remove the source from the map
    map.removeSource(sourceId);
  }
};

export default RemoveSourceAndLayerFromMap;
