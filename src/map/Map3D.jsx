import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import GL from "@luma.gl/constants";
import { Map } from "react-map-gl";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import { useEffect, useState } from "react";
import { load } from "@loaders.gl/core";

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  maxZoom: 20,
  pitch: 30,
  bearing: 0,
};

export default function Map3D() {
  // const mapContainer = useRef(null);
  const [mesh_, setMesh] = useState(
    "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/mesh/minicooper.obj"
  );

  const layers = [
    new SimpleMeshLayer({
      id: "SimpleMeshLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",

      /* props from SimpleMeshLayer class */

      getColor: (d) => [Math.sqrt(d.exits), 140, 0],
      getOrientation: (d) => [0, Math.random() * 180, 0],
      getPosition: (d) => d.coordinates,
      // getScale: [1, 1, 1],
      // getTransformMatrix: [],
      // getTranslation: [0, 0, 0],
      // material: true,
      mesh: mesh_,
      sizeScale: 30,
      // texture: null,
      // textureParameters: null,
      // wireframe: false,

      /* props inherited from Layer class */

      // autoHighlight: false,
      // coordinateOrigin: [0, 0, 0],
      // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      // highlightColor: [0, 0, 128, 128],
      loaders: [OBJLoader],
      // modelMatrix: null,
      // opacity: 1,
      pickable: true,
      // visible: true,
      // wrapLongitude: false,
    }),
  ];

  function getTooltip({ object }) {
    return (
      object &&
      `\
      ${object.address}
      ${object.name}`
    );
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file, "file");
    const data = await load(file, OBJLoader);
    // const temporaryUrl = URL.createObjectURL(file);
    // console.log(URL.createObjectURL());
    console.log(data);

    setMesh(file);
  };
  return (
    <>
      <div className="h-[80vh] w-full">
        <DeckGL
          layers={layers}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          pickingRadius={5}
          parameters={{
            blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
            blendEquation: GL.FUNC_ADD,
          }}
          getTooltip={getTooltip}
        >
          <Map
            reuseMaps
            mapLib={maplibregl}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
            preventStyleDiffing={true}
          />
        </DeckGL>
        <input
          onChange={handleFileChange}
          style={{ zIndex: 10000, position: "absolute" }}
          type="file"
        />
      </div>
    </>
  );
}
