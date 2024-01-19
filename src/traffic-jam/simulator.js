import { Car } from "@/traffic-jam/entities/car";
import { makeRandomDecoration } from "@/traffic-jam/objects/decorations";
import { randomAngle } from "@/utils/random";
import * as THREE from "three";
import { randFloat, randInt } from "three/src/math/MathUtils";

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
    this.group = await this.makeGroup();

    this.scene.add(this.group);
  }

  update({ delta }) {
    if (this.elapsedTimeSinceCarAdded > 0.5) {
      this.addRandomCar();
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

  async makeGroup() {
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

    for (let i = 0; i < 100; i++) {
      const decoration = await this.makeRandomDecoration();
      group.add(decoration);
    }

    return group;
  }

  async makeRandomDecoration() {
    const decorationMesh = await makeRandomDecoration();

    const side = randInt(0, 1) ? -1 : 1;

    const roadSafeDistance = ROAD_WIDTH * 1.5;
    const maxDistance = (4 * ROAD_LENGTH) / 5;
    decorationMesh.position.x = randFloat(
      (side * roadSafeDistance) / 2,
      (side * maxDistance) / 2,
    );
    decorationMesh.position.z = randFloat(-maxDistance / 2, maxDistance / 2);

    decorationMesh.rotation.y = randomAngle();

    return decorationMesh;
  }

  async addRandomCar() {
    const car = await Car.makeRandom();

    car.start();
    car.setPosition({ x: 0, y: 0, z: -ROAD_LENGTH / 2 });

    car.addToScene(this.group);

    this.cars.push(car);
  }

  removeCar(carToRemove) {
    carToRemove.removeFromScene(this.group);

    const carIndex = this.cars.findIndex(
      (car) => car.uuid === carToRemove.uuid,
    );

    this.cars.splice(carIndex, 1);
  }
}
