import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { TrafficJamSimulator } from "../simulator";
import { playRandomCarHorn } from "../sounds/carHorns";

export type CarSettings = {
  acceleration: number;
  maxSpeed: number;
  stopDistance: number;
  startDistance: number;
};

const MIN_SPEED = 0;

export class Car {
  private group: THREE.Group;
  private simulator: TrafficJamSimulator;

  readonly uuid: uuidv4;

  state: "started" | "stopped";

  private settings: CarSettings;

  private speedTarget: number = 0;
  speed: number = 0;

  private readonly honkUnderSpeed: number = 10;
  private readonly honkInterval: number = 4;
  private noHonkedSince: number = 0;

  constructor({
    model,
    simulator,
    settings,
  }: {
    model: any;
    simulator: TrafficJamSimulator;
    settings: CarSettings;
  }) {
    this.uuid = uuidv4();

    this.applySettings(settings);
    this.simulator = simulator;

    this.group = new THREE.Group();
    this.group.add(model);
  }

  applySettings(settings: CarSettings) {
    this.settings = settings;

    if (this.state === "started") {
      this.speedTarget = this.settings.maxSpeed;
    }
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
    if (this.speed > this.speedTarget) {
      this.speed -= this.settings.acceleration;
    }

    if (this.speed < this.speedTarget) {
      this.speed += this.settings.acceleration;
    }

    this.group.position.z += delta * this.speed;

    if (this.speed < this.honkUnderSpeed) {
      this.honkRegularly(delta);
    }
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
    this.state = "started";

    this.speedTarget = this.settings.maxSpeed;
  }

  stop(): void {
    this.state = "stopped";

    this.speedTarget = MIN_SPEED;
  }

  toggleState(): void {
    this.state === "started" ? this.stop() : this.start();
  }

  adjustSpeedWithCarAhead(car: Car | null): void {
    if (!car) {
      return;
    }

    const distance = this.distanceWithCar(car);

    if (distance < this.settings.stopDistance) {
      this.stop();
    } else if (distance > this.settings.startDistance) {
      this.start();
    }
  }

  private distanceWithCar(car: Car): number {
    return Math.abs(car.getPosition().z - this.getPosition().z);
  }
}
