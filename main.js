import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0x03fc0b
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff); 
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const addCone = (colour=0xffffff) => {
  const geometry = new THREE.ConeGeometry(1.5, 4, 10);
  const material = new THREE.MeshBasicMaterial({
    color: colour
  });
  const cone = new THREE.Mesh(geometry, material);
  scene.add(cone);
  return cone;
}

const addCylinder = (colour=0xffffff) => {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
  const material = new THREE.MeshBasicMaterial({
    color: colour
  });
  const cylinder = new THREE.Mesh(geometry, material);
  scene.add(cylinder);
  return cylinder;
}

const cone = addCone(0xff0000);
cone.position.set(20, 6, 3);

const cylinder = addCylinder(0xff0000);
cylinder.position.set(20, 0, 3);

const animate = () => {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();