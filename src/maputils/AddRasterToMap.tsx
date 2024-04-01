import {
  Map,
  LngLatBounds,
  RasterLayerSpecification,
  RasterSourceSpecification,
} from "maplibre-gl";

interface AddRasterProps {
  map: Map;
  layerId: string;
  sourceId: string;
  url: string;
  source_layer: string;
  zoomToLayer: boolean;
  extent: LngLatBounds;
  type: string;
  component: string;
}

function AddRasterToMap({
  map,
  layerId,
  sourceId,
  url,
  source_layer,
  zoomToLayer,
  extent,
  type,
  component,
}: AddRasterProps) {
  // Rest of your component code remains unchanged

  if (zoomToLayer) {
    map.fitBounds(extent);
  }

  if (type === "raster") {
    const newSourceRaster: RasterSourceSpecification = {
      type: "raster",
      tiles: [url],
      tileSize: 512,
    };
    map.addSource(sourceId, newSourceRaster);

    const newLayer: RasterLayerSpecification = {
      id: layerId,
      type: "raster",
      source: sourceId,
      minzoom: 0,
      maxzoom: 24,
    };
    map.addLayer(newLayer);
    map.moveLayer(`${layerId}`, "Continent labels");
  }
}

export default AddRasterToMap;
