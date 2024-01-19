import { Car } from "@/js/entities/car";
import { makeRandomDecoration } from "@/js/objects/decorations";
import { randomAngle } from "@/js/utils/random";
import * as THREE from "three";
import { randFloat, randInt } from "three/src/math/MathUtils";

const ROAD_WIDTH = 5;
const FLOOR_HEIGHT = 0.1;
const ROAD_LENGTH = 100;
const FLOOR_WIDTH = ROAD_LENGTH / 2 - ROAD_WIDTH;
const CAR_COUNT = 15;
const CAR_SUMMON_POSITION = {
  x: 0,
  y: 0,
  z: -ROAD_LENGTH / 2,
};

const CAR_MAX_SPEED = 15;
const CAR_STOP_DISTANCE = 5;
const CAR_START_DISTANCE = 10;

export class TrafficJamSimulator {
  scene = null;
  group = null;

  elapsedTimeSinceCarAdded = 0;
  cars = [];

  isMuted = true;

  constructor({ scene }) {
    this.scene = scene;
  }

  async init() {
    this.group = await this.makeGroup();

    this.scene.add(this.group);

    this.bindControls();
  }

  update({ delta }) {
    this.addCarIfEnoughSpace();

    this.cars.forEach((car) => {
      car.update({ delta });

      const carAhead = this.getCarAhead(car);
      if (carAhead) {
        car.adjustSpeedInFunctionOfCar(carAhead);
      }

      if (this.isCarOutOfMap(car)) {
        this.removeCar(car);
        return;
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

    // Ambient light
    const ambientLight = new THREE.AmbientLight("#EAE38C", 0.7);
    group.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight("#FF5733", 1);
    moonLight.position.set(35, 20, -50);
    const d = 50;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.camera.top = d;
    moonLight.castShadow = true;
    group.add(moonLight);

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

  async addCarIfEnoughSpace() {
    if (this.cars.length === 0) {
      this.addRandomCar();
      return;
    }

    const lastCardPosition = this.cars[this.cars.length - 1].getPosition();

    const randomDistance = randFloat(0, 30);

    if (
      lastCardPosition.z >
      CAR_SUMMON_POSITION.z + CAR_START_DISTANCE + randomDistance
    ) {
      this.addRandomCar();
    }

    this.elapsedTimeSinceCarAdded = 0;
  }

  async addRandomCar() {
    if (!this.group) {
      return;
    }

    const car = await Car.makeRandom(this);
    car.addToGroup(this.group);

    car.maxSpeed = CAR_MAX_SPEED;
    car.stopDistance = CAR_STOP_DISTANCE;
    car.startDistance = CAR_START_DISTANCE;

    car.setPosition(CAR_SUMMON_POSITION);

    if (this.cars.length === 0) {
      car.start();
    }

    this.cars.push(car);

    return car;
  }

  removeCar(carToRemove) {
    carToRemove.removeFromGroup(this.group);

    const carIndex = this.getCarIndex(carToRemove);

    this.cars.splice(carIndex, 1);
  }

  getCarIndex(carToFind) {
    return this.cars.findIndex((car) => car.uuid === carToFind.uuid);
  }

  getCarAhead(car) {
    const carIndex = this.getCarIndex(car);

    if (carIndex === 0) {
      return null;
    }
    return this.cars[carIndex - 1];
  }

  bindControls() {
    const toggleSoundBtn = document.getElementById("toggleSound");
    const toggleCarBtn = document.getElementById("toggleCar");

    toggleSoundBtn.addEventListener("click", () => {
      if (this.isMuted === true) {
        this.isMuted = false;
        toggleSoundBtn.classList.replace("muted", "unmuted");
      } else {
        this.isMuted = true;
        toggleSoundBtn.classList.replace("unmuted", "muted");
      }
    });

    const toggleFirstCar = () => {
      const firstCar = this.cars[0];

      if (!firstCar) {
        return;
      }

      const isStopped = firstCar.speed === 0;

      if (isStopped) {
        firstCar.start();
        toggleCarBtn.classList.replace("stopped", "started");
      } else {
        firstCar.stop();
        toggleCarBtn.classList.replace("started", "stopped");
      }
    };

    toggleCarBtn.addEventListener("click", () => {
      toggleFirstCar();
    });

    window.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        toggleFirstCar();
      }
    });
  }
}
