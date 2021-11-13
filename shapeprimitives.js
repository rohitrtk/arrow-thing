import * as THREE from 'three';

export const createBox = (width, height, depth, colour=0xffffff) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: colour
  });

  return new THREE.Mesh(geometry, material);
}

export const createSphere = (radius, colour=0xffffff) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const material = new THREE.MeshStandardMaterial({
    color: colour
  });

  return new THREE.Mesh(geometry, material);
}

export const createTorus = (radius, colour=0xffffff) => {
  const geometry = new THREE.TorusGeometry(radius, 4, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: colour
  });

  return new THREE.Mesh(geometry, material);
}

export const createCone = (radius, height, colour=0xffffff) => {
  const geometry = new THREE.ConeGeometry(radius, height, 10);
  const material = new THREE.MeshStandardMaterial({
    color: colour
  });

  return new THREE.Mesh(geometry, material);
}

export const createCylinder = (radius, height, colour=0xffffff) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 10, 32);
  const material = new THREE.MeshStandardMaterial({
    color: colour
  });

  return new THREE.Mesh(geometry, material);
}