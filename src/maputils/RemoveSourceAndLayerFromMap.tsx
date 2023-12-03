import { Map, LayerSpecification } from "maplibre-gl";
interface RemoveLayerProps {
  map: Map;
  layerId: string;
  sourceId: string;
}
const RemoveSourceAndLayerFromMap = ({
  map,
  layerId,
  sourceId,
}: RemoveLayerProps) => {
  const style = map.getStyle();
  const existingLayer = style.layers.find(
    (layer: LayerSpecification) => layer.id === layerId
  );
  const existingSource = style.sources[sourceId];

  if (existingLayer) {
    map.removeLayer(layerId);
  }

  if (existingSource) {
    map.removeSource(sourceId);
  }
};

export default RemoveSourceAndLayerFromMap;
