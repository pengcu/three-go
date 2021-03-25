import * as THREE from "three";
import shaderParse from '../helper/shaderParse';
import * as v1 from './glsl/particles.vert';
import * as v2 from './glsl/particles.frag';




export class Particles {
  constructor(webgl) {
    this.webgl = webgl;
    this.color1 = new THREE.Color("#ffffff");
    this.color2 = new THREE.Color("#e34532");
    this.WIDTH = 256;
    this.HIGHT = 256;
    this.AMOUNT = this.WIDTH * this.HIGHT;
    this.container = new THREE.Object3D();
  }
  init() {
    this.createParticleMesh()
  }

  createParticleMesh() {
    var position = new Float32Array(this.AMOUNT * 3);
    var i3;
    for (var i = 0; i < this.AMOUNT; i++) {
      i3 = i * 3;
      position[i3 + 0] = (0.5 - Math.random()) * 450;
      position[i3 + 1] = Math.pow(Math.random(), 20) * 45.5 * (Math.random() > 0.5 ? 1.0 : -1.0);
      position[i3 + 2] = (0.5 - Math.random()) * 350;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));


    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.shadowmap,
        {
          vtime: { type: 'f', value: 0 }
        }
      ]),
      vertexShader: shaderParse(v1),
      fragmentShader: shaderParse(v2),
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    var mesh = new THREE.Points(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.container.add(mesh)
    this.container.position.y = 100
    this.webgl.scene.add(this.container);
    this.mesh = mesh
  }


  update(ela) {
    this.mesh.material.uniforms.vtime.value = ela;
  }
}