import * as THREE from "three";

export class Light {
  constructor(webgl) {
    this.webgl = webgl;
  }

  init() {
    let mesh = new THREE.Object3D();
    mesh.position.set(0, 400, 0);
    let ambient = new THREE.AmbientLight(0x333333);
    mesh.add(ambient);
    let pointLight = new THREE.PointLight(0xffffff, 1, 700);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 700;
    // pointLight.shadow.camera.fov = 90;
    pointLight.shadow.bias = 0.1;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.Height = 2048;
    mesh.add(pointLight);
    var directionalLight = new THREE.DirectionalLight(0xba8b8b, 0.5);
    directionalLight.position.set(1, 1, 1);
    mesh.add(directionalLight);
    var directionalLight2 = new THREE.DirectionalLight(0x8bbab4, 0.3);
    directionalLight2.position.set(1, 1, -1);
    mesh.add(directionalLight2);

    this.mesh = mesh;
    this.pointLight = pointLight;
    this.webgl.scene.add(mesh);
    // const helper = new THREE.CameraHelper(pointLight.shadow.camera);
    // this.webgl.scene.add(helper);
  }
}