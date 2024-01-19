import { loadGltf } from "@/utils/gltf";
import { randomItem } from "@/utils/random";

export const carsCache = {};

const loadDecoration = async (carName) => {
  const carModel = await loadGltf(`/models/decorations/${carName}.glb`);

  carModel.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });

  return carModel.scene;
};

const decorationsCache = {};
const loadCachedDecoration = async (carName) => {
  if (!decorationsCache[carName]) {
    decorationsCache[carName] = await loadDecoration(carName);
  }

  return decorationsCache[carName].clone();
};

export const makeAcaciaTree = async () => {
  const mesh = await loadCachedDecoration("acacia-tree");

  const scale = 0.02;
  mesh.scale.set(scale, scale, scale);

  return mesh;
};

export const makeOakTree = async () => {
  const mesh = await loadCachedDecoration("oak-tree");

  const scale = 4;
  mesh.scale.set(scale, scale, scale);
  mesh.position.y = 5;

  return mesh;
};

export const makeBloackOakTree = async () => {
  const mesh = await loadCachedDecoration("black-oak-tree");

  const scale = 0.8;
  mesh.scale.set(scale, scale, scale);
  mesh.position.y = 0.5;

  return mesh;
};

export const makeBlueEyedGrass = async () => {
  const mesh = await loadCachedDecoration("blue-eyed-grass");

  const scale = 2;
  mesh.scale.set(scale, scale, scale);
  mesh.position.y = 0.5;

  return mesh;
};

const decorationMakers = [
  makeAcaciaTree,
  makeOakTree,
  makeBloackOakTree,
  makeBlueEyedGrass,
];

export const makeRandomDecoration = async () => {
  const selectedDecorationMaker = randomItem(decorationMakers);

  return selectedDecorationMaker();
};
