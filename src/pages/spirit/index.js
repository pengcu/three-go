import * as THREE from "three";
import { Basic } from '../base';
import { Particles } from './particles'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Spirit extends Basic {
  constructor(container, options = {}) {
    super(container);
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;
    this.orbitControls.maxDistance = 1000;
    this.orbitControls.minPolarAngle = 0.3;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1;
    this.orbitControls.enablePan = true;
    const bgColor = new THREE.Color("#ffffff");
    this.scene.fog = new THREE.FogExp2(bgColor, 0.001);

    const tmpColor = this.floor.mesh.material.color;
    tmpColor.lerp(bgColor, 0.05);
    this.scene.fog.color.copy(tmpColor);
    this.renderer.setClearColor(tmpColor.getHex());
  }

  addObjs() {

  }

  init() {
    this.xx = new Particles(this);
    this.xx.init()
    this.addObjs();
    this.tick()
  }

  update(delta) {
    this.xx.update(delta)
    // this.tick()
  }
}

let x = new Spirit(document.body)
x.loadAssets().then(x.init)