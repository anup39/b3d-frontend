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

  console.log(layerId, sourceId);

  const existingLayer = style?.layers?.find(
    (layer: LayerSpecification) => layer.id === layerId
  );
  const existingSource = style?.sources[sourceId];

  if (existingLayer) {
    console.log("removing layer", layerId);
    map.removeLayer(layerId);
  }

  if (existingSource) {
    console.log("removing source", sourceId);
    map.removeSource(sourceId);
  }
};

export default RemoveSourceAndLayerFromMap;
