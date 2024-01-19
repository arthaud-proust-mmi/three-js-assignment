import { randFloat } from "three/src/math/MathUtils";

export const randomAngle = () => randFloat(0, Math.PI * 2);

export const randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};
