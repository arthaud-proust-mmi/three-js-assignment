import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export const loadGltf = (path) => {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      path,
      (gltf) => resolve(gltf),
      (_progress) => {},
      (error) => reject(error),
    );
  });
};

export const enableShadows = (scene) => {
  const clone = scene.clone();

  clone.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });

  return clone;
};
