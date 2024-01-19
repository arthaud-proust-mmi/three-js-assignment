import { enableShadows, loadGltf } from "@/js/utils/gltf";
import { randomItem } from "@/js/utils/random";

const loadDecoration = async (carName: string) => {
  const carModel = await loadGltf(`/models/decorations/${carName}.glb`);

  return enableShadows(carModel.scene);
};

export const makeAcaciaTree = async () => {
  const mesh = await loadDecoration("acacia-tree");

  const scale = 0.02;
  mesh.scale.set(scale, scale, scale);

  return mesh;
};

export const makeOakTree = async () => {
  const mesh = await loadDecoration("oak-tree");

  const scale = 4;
  mesh.scale.set(scale, scale, scale);
  mesh.position.y = 5;

  return mesh;
};

export const makeBloackOakTree = async () => {
  const mesh = await loadDecoration("black-oak-tree");

  const scale = 0.8;
  mesh.scale.set(scale, scale, scale);
  mesh.position.y = 0.5;

  return mesh;
};

export const makeBlueEyedGrass = async () => {
  const mesh = await loadDecoration("blue-eyed-grass");

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
