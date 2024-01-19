import { enableShadows, loadGltf } from "@/js/utils/gltf";
import { randomItem } from "@/js/utils/random";

const loadCar = async (carName: string) => {
  const carModel = await loadGltf(`/models/cars/${carName}.glb`);

  return enableShadows(carModel.scene);
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
