import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
  const gltf = useGLTF("/scene_mesh_textured.glb");
  const modelRef = useRef();
  // Change initial position (for example)
  // if (modelRef.current) {
  //   modelRef.current.position.x = 15; // Change the X position
  //   modelRef.current.position.y = 10; // Change the Y position
  //   modelRef.current.position.z = 8; // Change the Z position
  // }

  return <primitive object={gltf.scene} ref={modelRef} />;
};

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <Model />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
