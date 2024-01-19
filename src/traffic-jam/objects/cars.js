import { enableShadows, loadGltf } from "@/utils/gltf";
import { randomItem } from "@/utils/random";
import { ObjectCache } from "./cache";

const carCache = new ObjectCache({
  loadFn: async (carName) => {
    const carModel = await loadGltf(`/models/cars/${carName}.glb`);

    return enableShadows(carModel.scene);
  },
});

export const makePoliceCar = async () => carCache.load("police-car");
export const makeCar1 = async () => carCache.load("car-1");
export const makeCar2 = async () => carCache.load("car-2");
export const makeSuv = async () => carCache.load("suv");
export const makeTaxi = async () => carCache.load("taxi");
export const makeSportsCar1 = async () => carCache.load("sports-car-1");
export const makeSportsCar2 = async () => carCache.load("sports-car-2");

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
