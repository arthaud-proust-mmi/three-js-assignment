import { Car, CarSettings } from "@/js/entities/car";
import { makeRandomDecoration } from "@/js/objects/decorations";
import { randomAngle, randomFloat, randomInt } from "@/js/utils/random";
import * as THREE from "three";
import { CarFactory } from "./entities/car.factory";

const ROAD_WIDTH = 5;
const FLOOR_HEIGHT = 0.1;
const ROAD_LENGTH = 100;
const FLOOR_WIDTH = ROAD_LENGTH / 2 - ROAD_WIDTH;
const CAR_SUMMON_POSITION = {
  x: 0,
  y: 0,
  z: -ROAD_LENGTH / 2,
};

export type TrafficJamSimulatorSettings = {
  maxCar: number;
  car: CarSettings;
};

export class TrafficJamSimulator {
  scene: THREE.Scene;
  group: THREE.Group;

  private settings: TrafficJamSimulatorSettings;
  cars: Array<Car> = [];

  isMuted: boolean = true;

  private toggleSoundBtn = document.getElementById("toggleSound");
  private toggleCarBtn = document.getElementById("toggleCar");

  constructor({ settings, scene }) {
    this.applySettings(settings);
    this.scene = scene;
  }

  async init() {
    this.group = await this.makeGroup();

    this.scene.add(this.group);

    this.bindControls();
  }

  applySettings(settings: TrafficJamSimulatorSettings) {
    this.settings = settings;

    this.cars.forEach((car) => {
      car.applySettings(this.settings.car);
    });
  }

  update({ delta }: { delta: number }): void {
    this.updateCarControl();

    this.addCarIfEnoughSpace();

    this.cars.forEach((car) => {
      car.update({ delta });

      car.adjustSpeedWithCarAhead(this.getCarAhead(car));

      if (this.isCarOutOfMap(car)) {
        this.removeCar(car);
        return;
      }
    });
  }

  isCarOutOfMap(car: Car): boolean {
    const { z } = car.getPosition();
    return z > ROAD_LENGTH / 2 || z < -ROAD_LENGTH / 2;
  }

  async makeGroup(): Promise<THREE.Group> {
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

  async makeRandomDecoration(): Promise<THREE.Group> {
    const decorationMesh = await makeRandomDecoration();

    const side = randomInt(0, 1) ? -1 : 1;

    const roadSafeDistance = ROAD_WIDTH * 1.5;
    const maxDistance = (4 * ROAD_LENGTH) / 5;
    decorationMesh.position.x = randomFloat(
      (side * roadSafeDistance) / 2,
      (side * maxDistance) / 2,
    );
    decorationMesh.position.z = randomFloat(-maxDistance / 2, maxDistance / 2);

    decorationMesh.rotation.y = randomAngle();

    return decorationMesh;
  }

  private async addCarIfEnoughSpace(): Promise<void> {
    if (this.cars.length >= this.settings.maxCar) {
      return;
    }

    if (this.cars.length === 0) {
      this.addRandomCar();
      return;
    }

    const lastCardPosition = this.cars[this.cars.length - 1].getPosition();

    const randomDistance = randomFloat(0, 30);

    if (
      lastCardPosition.z >
      CAR_SUMMON_POSITION.z + this.settings.car.startDistance + randomDistance
    ) {
      this.addRandomCar();
    }
  }

  private async addRandomCar(): Promise<Car> {
    if (!this.group) {
      return;
    }

    const car = await CarFactory.makeRandom({
      simulator: this,
      settings: this.settings.car,
    });
    car.addToGroup(this.group);

    car.setPosition(CAR_SUMMON_POSITION);

    if (this.cars.length === 0) {
      car.start();
    }

    this.cars.push(car);

    return car;
  }

  private removeCar(carToRemove: Car): void {
    carToRemove.removeFromGroup(this.group);

    const carIndex = this.getCarIndex(carToRemove);

    this.cars.splice(carIndex, 1);
  }

  private getCarIndex(carToFind: Car): number {
    return this.cars.findIndex((car) => car.uuid === carToFind.uuid);
  }

  private getCarAhead(car: Car): Car | null {
    const carIndex = this.getCarIndex(car);

    if (carIndex === 0) {
      return null;
    }
    return this.cars[carIndex - 1];
  }

  private bindControls(): void {
    this.toggleSoundBtn.addEventListener("click", () => {
      if (this.isMuted === true) {
        this.isMuted = false;
        this.toggleSoundBtn.classList.replace("muted", "unmuted");
      } else {
        this.isMuted = true;
        this.toggleSoundBtn.classList.replace("unmuted", "muted");
      }
    });

    const toggleFirstCarState = () => {
      const firstCar = this.cars[0];

      if (!firstCar) {
        return;
      }

      firstCar.toggleState();
    };

    this.toggleCarBtn.addEventListener("click", () => {
      toggleFirstCarState();
    });

    window.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        toggleFirstCarState();
      }
    });
  }

  updateCarControl() {
    const firstCar = this.cars[0];

    if (!firstCar) {
      return;
    }

    const isStopped = firstCar.state === "stopped";

    this.toggleCarBtn.classList.toggle("stopped", isStopped);
    this.toggleCarBtn.classList.toggle("started", !isStopped);
  }
}
