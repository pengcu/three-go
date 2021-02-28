import * as THREE from "three";

export class Floor {
  constructor(webgl) {
    this.webgl = webgl;
  }
  init() {
    let geometry = new THREE.PlaneGeometry(4000, 4000, 10, 10);
    let planeMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 1.0,
      color: 0x333333,
      emissive: 0x000000
    });

    let floor = new THREE.Mesh(geometry, planeMaterial);
    floor.rotation.x = -1.57;
    floor.position.setY(-100)
    floor.receiveShadow = true;
    this.mesh = floor
    this.webgl.scene.add(floor);
  }
}