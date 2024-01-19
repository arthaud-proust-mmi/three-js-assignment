import { randomItem } from "@/js/utils/random";

const carHorn1 = new Audio("/sounds/car-horn-1.mp3");
const carHorn2 = new Audio("/sounds/car-horn-2.mp3");
const carHorn3 = new Audio("/sounds/car-horn-3.mp3");
const carHorn4 = new Audio("/sounds/car-horn-4.mp3");

const horns = [carHorn1, carHorn2, carHorn3, carHorn4];

export const playRandomCarHorn = (): void => {
  const horn = randomItem(horns).cloneNode() as HTMLAudioElement;
  horn.currentTime = 0;
  horn.play();
};
