const RemoveSourceAndLayerFromMap = (map, layerId, sourceId) => {
  const style = map.getStyle();
  const existingLayer = style.layers.find((layer) => layer.id === layerId);
  const existingSource = style.sources[sourceId];

  if (existingLayer) {
    map.off("click", layerId);
    map.removeLayer(layerId);
  }

  if (existingSource) {
    map.removeSource(sourceId);
  }
};

export default RemoveSourceAndLayerFromMap;
