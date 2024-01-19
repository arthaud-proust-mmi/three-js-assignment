export const randomFloat = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomInt = (min, max) => Math.round(randomFloat(min, max));

export const randomAngle = () => randomFloat(0, Math.PI * 2);

export const randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};
