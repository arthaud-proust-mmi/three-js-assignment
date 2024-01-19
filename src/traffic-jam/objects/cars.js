import { enableShadows, loadGltf } from "@/utils/gltf";
import { randomItem } from "@/utils/random";

const loadCar = async (carName) => {
  const carModel = await loadGltf(`/models/cars/${carName}.glb`);

  return enableShadows(carModel.scene);
};

const carsCache = {};
const loadCachedCar = async (carName) => {
  if (!carsCache[carName]) {
    carsCache[carName] = await loadCar(carName);
  }

  return carsCache[carName].clone();
};

export const makePoliceCar = async () => loadCachedCar("police-car");
export const makeCar1 = async () => loadCachedCar("car-1");
export const makeCar2 = async () => loadCachedCar("car-2");
export const makeSuv = async () => loadCachedCar("suv");
export const makeTaxi = async () => loadCachedCar("taxi");
export const makeSportsCar1 = async () => loadCachedCar("sports-car-1");
export const makeSportsCar2 = async () => loadCachedCar("sports-car-2");

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
