import { TrafficJamSimulator } from "@/traffic-jam/simulator";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const trafficJamSimulator = new TrafficJamSimulator({ scene });

trafficJamSimulator.init();

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

  trafficJamSimulator.update({ delta });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
