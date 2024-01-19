export const randomFloat = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomInt = (min: number, max: number): number =>
  Math.round(randomFloat(min, max));

export const randomAngle = (): number => randomFloat(0, Math.PI * 2);

export const randomItem = <T>(items: Array<T>): T => {
  return items[Math.floor(Math.random() * items.length)];
};
