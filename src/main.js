import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { createBox, createTorus, createCylinder, createCone } from './shapeprimitives';
import { Arrow, TriArrow } from './arrow';

import './../style.css';
import { CameraHelper } from 'three';

// Scene, camera, and renderer setup
const fov   = 90;
const near  = 0.1;
const far   = 1000;
const aspectRatio = window.innerWidth / window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Adjust camera aspect ratio and renderer when the window gets resized
window.addEventListener('resize', event => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial camera position
camera.position.set(40, 40, 40);

// Transform controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.addEventListener('mouseDown', event => {
  orbitControls.enabled = false;
});
transformControls.addEventListener('mouseUp', event => {
  orbitControls.enabled = true;
});

// Lighting
const pointLight = new THREE.PointLight(0xffffff); 
const ambientLight = new THREE.AmbientLight(0xffffff);
//pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Shapes
const torus = createTorus(10, 0x44aa88);
scene.add(torus);
torus.userData.clickable = true;

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper(4);
scene.add(gridHelper, axesHelper);

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
let selected = null;

window.addEventListener('click', event => {
  mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouseClick, camera);
  const intersected = raycaster.intersectObjects(scene.children, true);
  
  if(intersected.length === 0) {
    transformControls.detach();
    selected = null;
    return;
  }

  const i = intersected[0];
  
  if(selected && i !== selected) {
    transformControls.detach();
    selected = null;
    return;
  }

  if(i.object.userData.clickable) {
    selected = i.object;
    
    transformControls.attach(selected);
    scene.add(transformControls);
  }
});

window.addEventListener('mousemove', event => {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

// Update function
const update = (dt) => {
  torus.rotation.x += 1 * dt;
  torus.rotation.y += 1 * dt;
  torus.rotation.z += 1 * dt;
  
  orbitControls.update();
}

// Main loop stuff
const clock = new THREE.Clock();

const animate = () => {
  const dt = clock.getDelta();
  update(dt);
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();