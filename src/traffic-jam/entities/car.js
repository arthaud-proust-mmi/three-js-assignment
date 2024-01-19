import { makeRandomCar } from "@/traffic-jam/objects/cars";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const CAR_SPEED = 15;

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
}
