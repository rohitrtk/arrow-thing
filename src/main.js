import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

window.addEventListener('keydown', event => {
  const key = event.key;
  console.log(event.key);
  if(key === 'w') {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.add(direction);
  }

  if(key === 's') {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.sub(direction);
  }
});

// Initial camera position
camera.position.set(40, 40, 40);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
console.log(controls.keys);

// Lighting
const pointLight = new THREE.PointLight(0xffffff); 
const ambientLight = new THREE.AmbientLight(0xffffff);
//pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Shapes
const torus = createTorus(10, 0x44aa88);
scene.add(torus);
torus.userData.draggable = true;

const arrow = new Arrow();
arrow.position.set(10, 0, 10);
scene.add(arrow);
arrow.userData.draggable = true;

const tArrow = new TriArrow();
tArrow.position.set(20, 0, 20);
scene.add(tArrow);
tArrow.userData.draggable = true;

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper(4);
scene.add(gridHelper, axesHelper);

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
let selected = null;

window.addEventListener('click', event => {
  if(selected) {
    selected = null;
    return;
  }

  mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouseClick, camera);
  const intersected = raycaster.intersectObjects(scene.children, true);
  
  if(intersected.length === 0) {
    return;
  }

  console.log(intersected);

  if(intersected[0].object.userData.draggable) {
    selected = intersected[0].object;
    //console.log(selected);
  } else if(intersected[0].object.parent.userData.draggable) {
    selected = intersected[0].object.parent;
    //console.log(selected);
  }
  //console.log(tArrow);
});

window.addEventListener('mousemove', event => {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

const dragObject = () => {
  if(selected !== null) {
    raycaster.setFromCamera(mouseMove, camera);
    const intersected = raycaster.intersectObjects(scene.children, true);
    
    if(intersected.length === 0) {
      return;
    }
    
    for(const obj of intersected) {
      selected.position.x = obj.point.x;
      selected.position.z = obj.point.z;
    }
  }
}

// Update function
const update = (dt) => {
  torus.rotation.x += 1 * dt;
  torus.rotation.y += 1 * dt;
  torus.rotation.z += 1 * dt;
  
  controls.update();

  if(selected !== null) {
    dragObject();
  }
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