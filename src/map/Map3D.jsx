import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import GL from "@luma.gl/constants";
import { Map } from "react-map-gl";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import { useEffect, useState } from "react";
import { load } from "@loaders.gl/core";
import { CubeGeometry } from "@luma.gl/core";
import { COORDINATE_SYSTEM } from "deck.gl";
import { LASLoader } from "@loaders.gl/las";

const INITIAL_VIEW_STATE = {
  longitude: 11.358708621125103,
  latitude: 55.399680861903335,
  // longitude: -300,
  // latitude: -540,
  // longitude: -122.45,
  // latitude: 37.7,
  zoom: 20,
  maxZoom: 20,
  pitch: 30,
  bearing: 0,
};

export default function Map3D() {
  const [data, setData] = useState([
    {
      position: [-122.45, 37.7],
      angle: 0,
      color: [255, 0, 0],
    },
    {
      position: [-122.46, 37.73],
      angle: 90,
      color: [0, 255, 0],
    },
  ]);

  // const SAMPLE_DATA = (([xCount, yCount], spacing) => {
  //   console.log("here");
  //   console.log([xCount, yCount]);
  //   const data = [];
  //   for (let x = 0; x < xCount; x++) {
  //     for (let y = 0; y < yCount; y++) {
  //       data.push({
  //         position: [
  //           (x - (xCount - 1) / 2) * spacing,
  //           (y - (yCount - 1) / 2) * spacing,
  //         ],
  //         color: [(x / (xCount - 1)) * 255, 128, (y / (yCount - 1)) * 255],
  //         orientation: [(x / (xCount - 1)) * 60 - 30, 0, -90],
  //       });
  //     }
  //   }
  //   console.log(data);
  //   return data;
  // })([10, 10], 120);

  const layers = [
    // new SimpleMeshLayer({
    //   id: "mesh-layer",
    //   data: SAMPLE_DATA,
    //   // texture: "texture.png",
    //   // mesh: new CubeGeometry(),
    //   mesh: "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj",
    //   // coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    //   loaders: [OBJLoader],
    //   getPosition: (d) => d.position,
    //   getColor: (d) => d.color,
    //   getOrientation: (d) => d.orientation,
    // }),
  ];

  function getTooltip({ object }) {
    return (
      object &&
      `\
      ${object.address}
      ${object.name}`
    );
  }

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   console.log(file, "file");
  //   const data = await load(file, OBJLoader);
  //   console.log(data);
  //   setMesh(
  //     "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj"
  //   );
  // };

  useEffect(() => {
    const get_data = async () => {
      const data_ = await load(
        "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj",
        OBJLoader
      );
      console.log(data_);
      // setData(data_.attributes.POSITION.value);
      // console.log(data_.attributes.POSITION);
    };
    get_data();

    const get_data_point_cloud = async () => {
      const data_ = await load(
        "http://137.135.165.161:8000/media/Uploads/OBJData/points.las",
        LASLoader
      );
      console.log(data_);
      // setData(data_.attributes.POSITION.value);
      // console.log(data_.attributes.POSITION);
    };
    get_data_point_cloud();
  }, []);
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
            mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${
              import.meta.env.VITE_MAPTILER_TOKEN
            }`}
            preventStyleDiffing={true}
          />
        </DeckGL>
        {/* <input
          onChange={handleFileChange}
          style={{ zIndex: 10000, position: "absolute" }}
          type="file"
        /> */}
      </div>
    </>
  );
}
