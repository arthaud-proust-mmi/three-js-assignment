import { makeRandomCar } from "@/traffic-jam/objects/cars";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { playRandomCarHorn } from "../sounds/carHorns";

export class Car {
  _group;

  simulator;
  uuid;

  stopDistance = 0;
  startDistance = 0;

  maxSpeed = 0;
  speed = 0;

  honkUnderSpeed = 10;
  honkInterval = 4;
  noHonkedSince = 0;

  static async makeRandom(simulator) {
    const randomModel = await makeRandomCar();

    return new Car(randomModel, simulator);
  }

  constructor(model, simulator) {
    this.simulator = simulator;
    this.uuid = uuidv4();
    this._group = new THREE.Group();
    this._group.add(model);
  }

  addToGroup(scene) {
    scene.add(this._group);
  }

  removeFromGroup(scene) {
    scene.remove(this._group);
  }

  getPosition() {
    return {
      x: this._group.position.x,
      y: this._group.position.y,
      z: this._group.position.z,
    };
  }

  setPosition({ x, y, z }) {
    this._group.position.set(x, y, z);
  }

  update({ delta }) {
    if (this.speed < this.honkUnderSpeed) {
      this.honkRegularly(delta);
    }

    this._group.position.z += delta * this.speed;
  }

  honkRegularly(delta) {
    this.noHonkedSince += delta;

    if (this.noHonkedSince > this.honkInterval) {
      this.noHonkedSince = 0;

      if (!this.simulator.isMuted) {
        playRandomCarHorn();
      }
    }
  }

  start() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }

  toggle() {
    this.speed === 0 ? this.start() : this.stop();
  }

  adjustSpeedInFunctionOfCar(car) {
    const distance = this.distanceWithCar(car);

    if (distance < this.stopDistance) {
      this.stop();
    } else if (distance > this.startDistance) {
      this.start();
    }
  }

  distanceWithCar(car) {
    return Math.abs(car.getPosition().z - this.getPosition().z);
  }
}
