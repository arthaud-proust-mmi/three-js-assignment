import { makeRandomCar } from "@/traffic-jam/objects/cars";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const CAR_SPEED = 15;
const STOP_DISTANCE = 5;
const START_DISTANCE = 10;

export class Car {
  _group = null;

  uuid = null;

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

  addToScene(scene) {
    scene.add(this._group);
  }

  removeFromScene(scene) {
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
    this.speed = CAR_SPEED;
  }

  stop() {
    this.speed = 0;
  }

  toggle() {
    this.speed === 0 ? this.start() : this.stop();
  }

  adjustSpeedInFunctionOfCarsAhead(cars) {
    const nearestDistance = cars.reduce(
      (actualNearestCarDistance, otherCar) => {
        const otherCarDistance = this.computeDistanceWith(otherCar);

        return Math.min(actualNearestCarDistance, otherCarDistance);
      },
      +Infinity,
    );

    if (nearestDistance < STOP_DISTANCE) {
      this.stop();
    } else if (nearestDistance > START_DISTANCE) {
      this.start();
    }
  }

  computeDistanceWith(car) {
    return Math.abs(car.getPosition().z - this._group.position.z);
  }
}
