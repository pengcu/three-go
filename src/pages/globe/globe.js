import * as THREE from "three";

export class G {
    constructor() {
        this.container = new THREE.Object3D();
    }

    init() {
        this.createG()
    }

    createG() {
        const texture = new THREE.TextureLoader().load("https://malikfaizanhaider.github.io/Interactive-globe/images/earth_black.png");
        const geometry = new THREE.IcosahedronGeometry(50, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00, map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        this.container.add(sphere)
        this.container.position.y = 100

    }
}