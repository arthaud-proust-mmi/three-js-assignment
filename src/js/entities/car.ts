import { makeRandomCar } from "@/js/objects/cars";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { TrafficJamSimulator } from "../simulator";
import { playRandomCarHorn } from "../sounds/carHorns";

export class Car {
  private group: THREE.Group;
  private simulator: TrafficJamSimulator;

  uuid: uuidv4;

  stopDistance: number = 0;
  startDistance: number = 0;

  maxSpeed: number = 0;
  speed: number = 0;

  honkUnderSpeed: number = 10;
  honkInterval: number = 4;
  noHonkedSince: number = 0;

  static async makeRandom(simulator: TrafficJamSimulator): Promise<Car> {
    const randomModel = await makeRandomCar();

    return new Car(randomModel, simulator);
  }

  constructor(model, simulator: TrafficJamSimulator) {
    this.uuid = uuidv4();
    this.simulator = simulator;

    this.group = new THREE.Group();
    this.group.add(model);
  }

  addToGroup(group: THREE.Group): void {
    group.add(this.group);
  }

  removeFromGroup(group: THREE.Group): void {
    group.remove(this.group);
  }

  getPosition() {
    return {
      x: this.group.position.x,
      y: this.group.position.y,
      z: this.group.position.z,
    };
  }

  setPosition({ x, y, z }: { x: number; y: number; z: number }): void {
    this.group.position.set(x, y, z);
  }

  update({ delta }: { delta: number }): void {
    if (this.speed < this.honkUnderSpeed) {
      this.honkRegularly(delta);
    }

    this.group.position.z += delta * this.speed;
  }

  private honkRegularly(delta: number): void {
    this.noHonkedSince += delta;

    if (this.noHonkedSince > this.honkInterval) {
      this.noHonkedSince = 0;

      if (!this.simulator.isMuted) {
        playRandomCarHorn();
      }
    }
  }

  start(): void {
    this.speed = this.maxSpeed;
  }

  stop(): void {
    this.speed = 0;
  }

  adjustSpeedInFunctionOfCar(car: Car): void {
    const distance = this.distanceWithCar(car);

    if (distance < this.stopDistance) {
      this.stop();
    } else if (distance > this.startDistance) {
      this.start();
    }
  }

  private distanceWithCar(car: Car): number {
    return Math.abs(car.getPosition().z - this.getPosition().z);
  }
}
