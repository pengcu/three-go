import * as THREE from "three";
import { Basic } from '../base';
import { G } from './globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Globe extends Basic {
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
        let a = new G();
        a.init()
        console.log(a.container)
        this.scene.add(a.container)
    }

    init() {
        this.addObjs();
        this.tick()
    }

    update(delta) {
    }
}

let x = new Globe(document.body)
x.loadAssets().then(x.init)