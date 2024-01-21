import { Car, CarSettings } from "@/js/entities/car";
import { makeRandomCar } from "@/js/objects/cars";
import { TrafficJamSimulator } from "@/js/simulator";

export class CarFactory {
  static async makeRandom({
    simulator,
    settings,
  }: {
    simulator: TrafficJamSimulator;
    settings: CarSettings;
  }): Promise<Car> {
    const model = await makeRandomCar();

    return new Car({ model, simulator, settings });
  }
}
