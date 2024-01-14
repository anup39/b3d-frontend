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
import { PointCloudLayer } from "@deck.gl/layers";
import {
  // COORDINATE_SYSTEM,
  OrbitView,
  // LinearInterpolator,
} from "@deck.gl/core";

import React from "react";
import { Tile3DLayer } from "@deck.gl/geo-layers";

import { CesiumIonLoader } from "@loaders.gl/3d-tiles";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";

import { GLTFLoader } from "@loaders.gl/gltf";
import { Button } from "@mui/material";
import { setDisplayType } from "../reducers/MapView";
import { useDispatch } from "react-redux";

// // const INITIAL_VIEW_STATE = {
// //   latitude: 47.65,
// //   longitude: 7,
// //   zoom: 4.5,
// //   maxZoom: 16,
// //   pitch: 50,
// //   bearing: 0,
// // };

// const INITIAL_VIEW_STATE = {
//   target: [649387.78125, 6141818.5, 37.697425365448],
//   rotationX: 30, // Change this value for X-axis rotation
//   rotationOrbit: 30, // Change this value for orbit rotation
//   orbitAxis: "Y",
//   fov: 50,
//   minZoom: 0,
//   maxZoom: 10,
//   zoom: 1,
// };

// function calculateBounds(attributes) {
//   const mins = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
//   const maxs = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];

//   const pointSize = attributes.POSITION.size;
//   const pointCount = attributes.POSITION.value.length / pointSize;

//   for (let i = 0; i < pointCount; i += pointSize) {
//     const x = attributes.POSITION.value[i];
//     const y = attributes.POSITION.value[i + 1];
//     const z = attributes.POSITION.value[i + 2];

//     if (x < mins[0]) mins[0] = x;
//     else if (x > maxs[0]) maxs[0] = x;

//     if (y < mins[1]) mins[1] = y;
//     else if (y > maxs[1]) maxs[1] = y;

//     if (z < mins[2]) mins[2] = z;
//     else if (z > maxs[2]) maxs[2] = z;
//   }

//   return { mins, maxs };
// }

// function convertLoadersMeshToDeckPointCloudData(attributes) {
//   const deckAttributes = {
//     getPosition: attributes.POSITION,
//   };
//   if (attributes.COLOR_0) {
//     deckAttributes.getColor = attributes.COLOR_0;
//   }
//   if (attributes.TEXCOORD_0) {
//     deckAttributes.getOrientation = attributes.TEXCOORD_0;
//   }
//   // Check PointCloudLayer docs for other supported props?
//   return {
//     length: attributes.POSITION.value.length / attributes.POSITION.size,
//     attributes: deckAttributes,
//   };
// }

// export default function Map3D() {
//   const [data, setData] = useState([
//     {
//       position: [-122.45, 37.7],
//       angle: 0,
//       color: [255, 0, 0],
//     },
//     {
//       position: [-122.46, 37.73],
//       angle: 90,
//       color: [0, 255, 0],
//     },
//   ]);

//   // const SAMPLE_DATA = (([xCount, yCount], spacing) => {
//   //   console.log("here");
//   //   console.log([xCount, yCount]);
//   //   const data = [];
//   //   for (let x = 0; x < xCount; x++) {
//   //     for (let y = 0; y < yCount; y++) {
//   //       data.push({
//   //         position: [
//   //           (x - (xCount - 1) / 2) * spacing,
//   //           (y - (yCount - 1) / 2) * spacing,
//   //         ],
//   //         color: [(x / (xCount - 1)) * 255, 128, (y / (yCount - 1)) * 255],
//   //         orientation: [(x / (xCount - 1)) * 60 - 30, 0, -90],
//   //       });
//   //     }
//   //   }
//   //   console.log(data);
//   //   return data;
//   // })([10, 10], 120);

//   const layers = [
//     // new SimpleMeshLayer({
//     //   id: "mesh-layer",
//     //   data: data,
//     //   // texture: "texture.png",
//     //   // mesh: new CubeGeometry(),
//     //   // mesh: "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj",
//     //   coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
//     //   loaders: [OBJLoader],
//     //   // getPosition: (d) => d.position,
//     //   // getColor: (d) => d.color,
//     //   // getOrientation: (d) => d.orientation,
//     // }),
//     new PointCloudLayer({
//       id: "point-cloud-layer",
//       // data,
//       coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
//       data: data,
//       getNormal: [0, 1, 0],
//       getColor: (d) => d.color,
//       opacity: 0.5,
//       pointSize: 0.5,
//     }),
//   ];

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     console.log(file, "file");
//     // const data = await load(file, OBJLoader);
//     // console.log(data);
//     // setMesh(
//     //   "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj"
//     // );

//     const data_ = await load(file, LASLoader);
//     console.log(data_);
//     const pointData = convertLoadersMeshToDeckPointCloudData(data_.attributes);
//     console.log(pointData);
//     setData(pointData);

//     // const data_ = await load(file, OBJLoader);
//     // console.log(data_);
//     // const pointData = convertLoadersMeshToDeckPointCloudData(data_.attributes);
//     // console.log(pointData);
//     // setData(pointData);
//   };

//   useEffect(() => {
//     // const get_data = async () => {
//     //   const data_ = await load(
//     //     "http://137.135.165.161:8000/media/Uploads/OBJData/scene_mesh_textured_53lv7ev.obj",
//     //     OBJLoader
//     //   );
//     //   console.log(data_);
//     //   const pointData = convertLoadersMeshToDeckPointCloudData(
//     //     data_.attributes
//     //   );
//     //   setData(pointData);
//     //   // console.log(data_.attributes.POSITION);
//     // };
//     // get_data();
//     // const get_data_point_cloud = async () => {
//     //   console.log("here");
//     //   const data_ = await load(
//     //     "http://137.135.165.161:8000/media/Uploads/OBJData/points.las",
//     //     LASLoader
//     //   );
//     //   console.log(data_);
//     //   // const pointData = convertLoadersMeshToDeckPointCloudData(
//     //   //   data_.attributes
//     //   // );
//     //   // const { maxs, mins } = calculateBounds(data_.attributes);
//     //   // const target = [
//     //   //   (mins[0] + maxs[0]) / 2,
//     //   //   (mins[1] + maxs[1]) / 2,
//     //   //   (mins[2] + maxs[2]) / 2,
//     //   // ];
//     //   console.log("here");
//     //   // console.log(target);
//     //   // console.log(pointData);
//     //   // setData(pointData);
//     //   // console.log(data_.attributes.POSITION);
//     // };
//     // get_data_point_cloud();
//   }, []);
//   return (
//     <>
//       <div className="h-[80vh] w-full">
//         {/* <DeckGL
//           layers={layers}
//           initialViewState={INITIAL_VIEW_STATE}
//           controller={true}
//           pickingRadius={5}
//           parameters={{
//             blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
//             blendEquation: GL.FUNC_ADD,
//           }}
//         >
//           <Map
//             reuseMaps
//             mapLib={maplibregl}
//             mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${
//               import.meta.env.VITE_MAPTILER_TOKEN
//             }`}
//             preventStyleDiffing={true}
//           />
//         </DeckGL> */}
//         <DeckGL
//           views={new OrbitView()}
//           viewState={INITIAL_VIEW_STATE}
//           controller={true}
//           // onViewStateChange={this._onViewStateChange}
//           layers={layers}
//           // parameters={{
//           //   clearColor: [0.07, 0.14, 0.19, 1],
//           // }}
//         />
//         <input
//           onChange={handleFileChange}
//           style={{ zIndex: 10000, position: "absolute" }}
//           type="file"
//         />
//       </div>
//     </>
//   );
// }

const ION_ASSET_ID = 2406687;
const ION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMzQwZmM2OC04Yjg2LTQ2OTAtOGYwMC1lMGUzMTU0NGI1ZjgiLCJpZCI6MTg2MjgyLCJpYXQiOjE3MDM1MDk5MDB9.Vwm4_9ZQT9K7O1I_fi4dc7AlvLkuCRDPL9HclO9GES0";
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 40,
  longitude: -75,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 20,
};

export default function App({
  mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  updateAttributions,
}) {
  const dispatch = useDispatch();
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const onTilesetLoad = (tileset) => {
    // Recenter view to cover the new tileset
    const { cartographicCenter, zoom } = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom: 17,
    });

    if (updateAttributions) {
      updateAttributions(tileset.credits && tileset.credits.attributions);
    }
  };

  const tile3DLayer = new Tile3DLayer({
    id: "tile-3d-layer",
    pointSize: 2,
    data: TILESET_URL,
    loader: CesiumIonLoader,
    loadOptions: { "cesium-ion": { accessToken: ION_TOKEN } },
    onTilesetLoad,
  });

  const GLTF_BASE_URL =
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/";

  const GLTF_DEFAULT_MODEL = `${GLTF_BASE_URL}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`;

  const MODEL_ORIGIN = [
    INITIAL_VIEW_STATE.longitude,
    INITIAL_VIEW_STATE.latitude,
    0,
  ];

  useEffect(() => {
    const get_data_point_gltf = async () => {
      console.log("here");
      const data_ = await load(
        "http://137.135.165.161:8000/media/Uploads/OBJData/points.las",
        GLTFLoader
      );
      console.log(data_);
      // const pointData = convertLoadersMeshToDeckPointCloudData(
      //   data_.attributes
      // );
      // const { maxs, mins } = calculateBounds(data_.attributes);
      // const target = [
      //   (mins[0] + maxs[0]) / 2,
      //   (mins[1] + maxs[1]) / 2,
      //   (mins[2] + maxs[2]) / 2,
      // ];
      console.log("here");
      // console.log(target);
      // console.log(pointData);
      // setData(pointData);
      // console.log(data_.attributes.POSITION);
    };
    get_data_point_gltf();
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          dispatch(setDisplayType("2D"));
        }}
        sx={{
          // position: "absolute",
          // top: "40%",
          // right: "50px",
          margin: "10px",
          zIndex: 999999,
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "white",
          },
          color: "#D51B60",
        }}
      >
        2D
      </Button>
      <DeckGL
        layers={[tile3DLayer]}
        initialViewState={initialViewState}
        controller={true}
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={mapStyle}
          preventStyleDiffing
        />
      </DeckGL>
    </div>
  );
}
