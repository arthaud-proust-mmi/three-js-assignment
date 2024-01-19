import { makeRandomCar } from "@/traffic-jam/objects/cars";
import * as THREE from "three";
import { Car } from "./car";

const ROAD_WIDTH = 5;
const FLOOR_HEIGHT = 0.1;
const ROAD_LENGTH = 100;
const FLOOR_WIDTH = ROAD_LENGTH / 2 - ROAD_WIDTH;

export class TrafficJamSimulator {
  scene = null;
  group = null;

  elapsedTimeSinceCarAdded = 0;
  cars = [];

  constructor({ scene }) {
    this.scene = scene;
  }

  async init() {
    const group = await this.buildGroup();

    this.scene.add(group);

    await this.addCar();
  }

  async buildGroup() {
    const group = new THREE.Group();

    const floor = new THREE.Group();
    floor.position.y = -FLOOR_HEIGHT / 2;
    group.add(floor);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: "#333" });
    const roadGeometry = new THREE.BoxGeometry(
      ROAD_WIDTH,
      FLOOR_HEIGHT,
      ROAD_LENGTH,
    );
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.receiveShadow = true;
    floor.add(road);

    const grassMaterial = new THREE.MeshStandardMaterial({ color: "#268b07" });
    const grassGeometry = new THREE.BoxGeometry(
      FLOOR_WIDTH,
      FLOOR_HEIGHT,
      ROAD_LENGTH,
    );
    const grassLeft = new THREE.Mesh(grassGeometry, grassMaterial);
    grassLeft.position.x = -(FLOOR_WIDTH / 2 + ROAD_WIDTH / 2);
    grassLeft.receiveShadow = true;
    floor.add(grassLeft);

    const grassRight = new THREE.Mesh(grassGeometry, grassMaterial);
    grassRight.position.x = FLOOR_WIDTH / 2 + ROAD_WIDTH / 2;
    grassRight.receiveShadow = true;
    floor.add(grassRight);

    return group;
  }

  update({ delta }) {
    if (this.elapsedTimeSinceCarAdded > 0.5) {
      this.addCar();
      this.elapsedTimeSinceCarAdded = 0;
    } else {
      this.elapsedTimeSinceCarAdded += delta;
    }

    this.cars.forEach((car) => {
      car.update({ delta });

      if (this.isCarOutOfMap(car)) {
        this.removeCar(car);
      }
    });
  }

  isCarOutOfMap(car) {
    const { z } = car.getPosition();
    return z > ROAD_LENGTH / 2 || z < -ROAD_LENGTH / 2;
  }

  async addCar() {
    const carModel = await makeRandomCar();

    carModel.position.z = -ROAD_LENGTH / 2;

    const car = new Car(carModel);
    car.addToScene(this.scene);

    car.start();

    this.cars.push(car);
  }

  removeCar(carToRemove) {
    carToRemove.removeFromScene(this.scene);

    const carIndex = this.cars.findIndex(
      (car) => car.uuid === carToRemove.uuid,
    );

    this.cars.splice(carIndex, 1);
  }
}
