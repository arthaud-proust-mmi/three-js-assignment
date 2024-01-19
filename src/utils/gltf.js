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
