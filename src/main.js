import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { createBox, createTorus, createCylinder, createCone } from './shapeprimitives';

import './../style.css';

// Html references
const canvas = document.querySelector('.canvas');

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
scene.name = 'Scene';

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setPixelRatio(window.devicePixelRatio);

const fov   = 90;
const near  = 0.1;
const far   = 1000;
const aspectRatio = canvas.width / canvas.height;

const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

const resizeCanvas = () => {
  const width   = canvas.clientWidth;
  const height  = canvas.clientHeight;

  if(canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
resizeCanvas();

// When the window is resized, resize the canvas
window.addEventListener('resize', resizeCanvas);

// Initial camera position
camera.position.set(40, 40, 40);

// Transform controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
const transformControls = new TransformControls(camera, renderer.domElement);
let transformControlsClicked = false;
transformControls.addEventListener('mouseDown', event => {
  orbitControls.enabled = false;
  transformControlsClicked = true;
});
transformControls.addEventListener('mouseUp', event => {
  orbitControls.enabled = true;
});
scene.add(transformControls);

// Lighting
const pointLight = new THREE.PointLight(0xffffff); 
const ambientLight = new THREE.AmbientLight(0xffffff);
//pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Shapes
const torus = createTorus(10, 0x44aa88);
scene.add(torus);
torus.name = 'Torus 1';
torus.userData.clickable = true;
//torus.userData.sceneExplorer = true;

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper(4);
scene.add(gridHelper, axesHelper);

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
let selected = null;

window.addEventListener('click', event => {
  const width   = canvas.width;
  const height  = canvas.height;

  mouseClick.x = (event.clientX / width) * 2 - 1;
  mouseClick.y = - (event.clientY / height) * 2 + 1;
  
  raycaster.setFromCamera(mouseClick, camera);
  const intersectArray = raycaster.intersectObjects(scene.children, true);

  for(let i = 0; i < intersectArray.length; i++) {
    const intersected = intersectArray[i].object;
    
    if(intersected && intersected.userData.clickable) {
      selected = intersected;
      transformControls.attach(selected);
      
      break;
    } else if(transformControlsClicked) {
      transformControlsClicked = false;
      break;
    } else {
      selected = null;
      transformControls.detach();
    }
  }
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

const createSceneHierachy = () => {
  const hierachy = document.querySelector('.scene-hierarchy-list');

  const rootNode = scene;
  if(!rootNode.userData.depth) {
    rootNode.userData.depth = 0;
  }

  let stack = [];
  stack.push(rootNode);

  const SPACE = '&nbsp;';

  while(stack.length > 0) {
    const currentNode = stack.pop();
    const nodeName = currentNode.name;

    if(nodeName === '') {
      continue;
    }

    const nodeDepth = currentNode.userData.depth;

    const listElement = document.createElement('li');
    listElement.innerHTML = `${SPACE.repeat(2 * nodeDepth)}${nodeName}`;
    hierachy.appendChild(listElement);

    const children = currentNode.children;
    const numChildren = children.length;

    for(let i = numChildren - 1; i >= 0; i--) {
      if(children[i]) {
        children[i].userData.depth = nodeDepth + 1;
        stack.push(children[i]);
      }
    }
  }
}

createSceneHierachy();
