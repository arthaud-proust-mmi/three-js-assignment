import { v4 as uuidv4 } from "uuid";

const CAR_SPEED = 15;

export class Car {
  _model = null;

  uuid = null;

  speed = 0;

  constructor(model) {
    this.uuid = uuidv4();
    this._model = model;
  }

  addToScene(scene) {
    scene.add(this._model);
  }

  removeFromScene(scene) {
    scene.remove(this._model);
  }

  getPosition() {
    return {
      x: this._model.position.x,
      y: this._model.position.y,
      z: this._model.position.z,
    };
  }

  update({ delta }) {
    this._model.position.z += delta * this.speed;
  }

  start() {
    this.speed = CAR_SPEED;
  }

  stop() {
    this.speed = 0;
  }
}
