import {
  TrafficJamSimulator,
  TrafficJamSimulatorSettings,
} from "@/js/simulator";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.Cache.enabled = true;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * GUI
 */
const gui = new GUI();
gui.close();

/**
 * Experience
 */
const simulatorSettings: TrafficJamSimulatorSettings = {
  maxCar: 20,
  car: {
    acceleration: 0.5,
    maxSpeed: 15,
    stopDistance: 10,
    startDistance: 10,
  },
};

const simulator = new TrafficJamSimulator({
  scene,
  settings: simulatorSettings,
});

gui
  .add(simulatorSettings, "maxCar")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    simulator.applySettings(simulatorSettings);
  });

gui
  .add(simulatorSettings.car, "acceleration")
  .min(0.1)
  .max(5)
  .step(0.1)
  .onFinishChange(() => {
    simulator.applySettings(simulatorSettings);
  });

gui
  .add(simulatorSettings.car, "maxSpeed")
  .min(5)
  .max(30)
  .step(1)
  .onFinishChange(() => {
    simulator.applySettings(simulatorSettings);
  });

gui
  .add(simulatorSettings.car, "stopDistance")
  .min(5)
  .max(30)
  .step(1)
  .onFinishChange(() => {
    simulator.applySettings(simulatorSettings);
  });

gui
  .add(simulatorSettings.car, "startDistance")
  .min(7)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    simulator.applySettings(simulatorSettings);
  });

simulator.init();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  200,
);
camera.position.x = 10;
camera.position.y = 45;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update controls
  controls.update();

  simulator.update({ delta });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
