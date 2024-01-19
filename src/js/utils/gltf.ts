import { Group, Object3D } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export const loadGltf = (path: string): Promise<GLTF> => {
  return new Promise<GLTF>((resolve, reject) => {
    gltfLoader.load(
      path,
      (gltf) => resolve(gltf),
      (_progress) => {},
      (error) => reject(error),
    );
  });
};

export const enableShadows = (scene: Group): Group => {
  const clone = scene.clone();

  clone.traverse(function (node: Object3D) {
    if ("isMesh" in node && node.isMesh) {
      node.castShadow = true;
    }
  });

  return clone;
};
