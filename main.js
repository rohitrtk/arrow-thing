import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { createBox, createTorus, createCylinder, createCone } from './shapeprimitives';

import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// Shapes
const torus = createTorus(10);
scene.add(torus);
torus.userData.draggable = true;

const cone = createCone(10, 10, 0xff);
scene.add(cone);
cone.position.set(10, 5, 10);
cone.userData.draggable = true;

// Lighting
const pointLight = new THREE.PointLight(0xffffff); 
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const addAxesArrowHelper = (origin=new THREE.Vector3(0, 0, 0)) => {
  const directionVectors = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
  }

  const xArrowHelper = new THREE.ArrowHelper(directionVectors.x, origin, 10, 0xff0000, 1, 1);
  const yArrowHelper = new THREE.ArrowHelper(directionVectors.y, origin, 10, 0x00ff00, 1, 1);
  const zArrowHelper = new THREE.ArrowHelper(directionVectors.z, origin, 10, 0x0000ff, 1, 1);
  scene.add(xArrowHelper, yArrowHelper, zArrowHelper);
}
addAxesArrowHelper();

const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  
  controls.update();
  dragObject();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
let selected = null;

window.addEventListener('click', event => {
  if(selected) {
    //selected.position.y -= 3;
    selected = null;
    return;
  }
  mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouseClick, camera);
  const intersected = raycaster.intersectObjects(scene.children);
  if(intersected.length > 0 && intersected[0].object.userData.draggable) {
    selected = intersected[0].object;
    //selected.position.y += 3;
  }
});

window.addEventListener('mousemove', event => {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

const dragObject = () => {
  if(selected !== null) {
    raycaster.setFromCamera(mouseMove, camera);
    const intersected = raycaster.intersectObjects(scene.children);
    if(intersected.length > 0) {
      for(const obj of intersected) {
        selected.position.x = obj.point.x;
        selected.position.z = obj.point.z;
      }
    }
  }
}

animate();