import * as THREE from "three";
import { Floor } from './floor';
import { Light } from './light';

export class Basic {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
      // alpha: true
    });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setClearColor(new THREE.Color("#343434"))
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      10,
      3000
    );
    this.camera.position.set(300, 60, 300).normalize().multiplyScalar(1000);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.floor = new Floor(this);
    this.light = new Light(this);
    this.light.init()
    this.floor.init()
    this.assets = {};
    this.disposed = false;
    this.tick = this.tick.bind(this);
    this.init = this.init.bind(this);
    container.append(this.renderer.domElement);
  }

  loadAssets() {
    return Promise.resolve()
  }

  init() {
    this.tick();
  }

  dispose() {
    this.disposed = true;
  }

  onResize() { }

  update(delta) { }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  tick() {
    if (this.disposed) return;
    if (resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.onResize();
    }
    const delta = this.clock.getDelta();
    this.render(delta);
    this.update(delta);
    requestAnimationFrame(this.tick);
  }
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
