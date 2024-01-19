import { makeRandomCar } from "@/traffic-jam/objects/cars";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

export class Car {
  _group = null;

  uuid = null;

  stopDistance = 0;
  startDistance = 0;

  maxSpeed = 0;
  speed = 0;

  static async makeRandom() {
    const randomModel = await makeRandomCar();

    return new Car(randomModel);
  }

  constructor(model) {
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
    this._group.position.z += delta * this.speed;
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
