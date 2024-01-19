import { randomItem } from "@/utils/array";
import { loadGltf } from "@/utils/gltf";

export const carsCache = {};

const loadCar = async (carName) => {
  const carModel = await loadGltf(`/models/cars/${carName}.glb`);

  carModel.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });

  return carModel.scene;
};

const loadCachedCar = async (carName) => {
  if (!carsCache[carName]) {
    carsCache[carName] = await loadCar(carName);
  }

  return carsCache[carName];
};

export const makePoliceCar = async () => loadCar("police-car");
export const makeCar1 = async () => loadCar("car-1");
export const makeCar2 = async () => loadCar("car-2");
export const makeSuv = async () => loadCar("suv");
export const makeTaxi = async () => loadCar("taxi");
export const makeSportsCar1 = async () => loadCar("sports-car-1");
export const makeSportsCar2 = async () => loadCar("sports-car-2");

const carMakers = [
  makePoliceCar,
  makeCar1,
  makeCar2,
  makeSuv,
  makeTaxi,
  makeSportsCar1,
  makeSportsCar2,
];

export const makeRandomCar = async () => {
  const selectedCarMaker = randomItem(carMakers);

  return selectedCarMaker();
};
