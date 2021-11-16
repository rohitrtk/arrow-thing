import * as THREE from 'three';
import { ConeBufferGeometry, CylinderBufferGeometry, Mesh, MeshStandardMaterial } from 'three';

const createGeometries = (tailRadius, tailHeight, headRadius, headHeight) => {
  const head = new ConeBufferGeometry(headRadius, headHeight, 10);
  const tail = new CylinderBufferGeometry(tailRadius, tailRadius, tailHeight, 10, 32);

  return {
    head,
    tail
  }
}

const createMaterials = (colour) => {
  const material = new MeshStandardMaterial({
    color: colour,
    flatShading: true
  });

  return {
    material
  };
}

const createMeshes = (tailRadius, tailHeight, headRadius, headHeight, colour) => {
  const geometries = createGeometries(tailRadius, tailHeight, headRadius, headHeight);
  const materials = createMaterials(colour);

  const tail = new Mesh(geometries.tail, materials.material);
  tail.position.set(0, 0, 0);

  const head = new Mesh(geometries.head, materials.material);
  head.position.set(0, tailHeight / 2 + headHeight / 2, 0);

  return {
    head,
    tail
  }
}

export class Arrow extends THREE.Group {
  constructor(tailRadius=0.25, tailHeight=10, headRadius=0.75, headHeight=4, colour=0xffffff) {
    super();

    this.meshes = createMeshes(tailRadius, tailHeight, headRadius, headHeight, colour);
    
    this.add(
      this.meshes.tail,
      this.meshes.head
    );

    this.userData.draggable = true;
  }
}

export class TriArrow extends THREE.Group {
  constructor(tailRadius=0.25, tailHeight=10, headRadius=0.75, headHeight=4) {
    super();

    this.xArrow = new Arrow(tailRadius, tailHeight, headRadius, headHeight, 0xff0000);
    this.xArrow.rotation.set(0, 0, -Math.PI / 2);
    this.xArrow.position.x += tailHeight * 0.5;

    this.yArrow = new Arrow(tailRadius, tailHeight, headRadius, headHeight, 0x00ff00);
    this.yArrow.position.y += tailHeight * 0.5;

    this.zArrow = new Arrow(tailRadius, tailHeight, headRadius, headHeight, 0x0000ff);
    this.zArrow.rotation.set(Math.PI / 2, 0, 0);
    this.zArrow.position.z += tailHeight * 0.5;

    this.add(
      this.xArrow,
      this.yArrow,
      this.zArrow
    );
  }
}