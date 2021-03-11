import * as THREE from "three";
import shaderParse from '../helper/shaderParse';
import { rand } from '../helper/calc';
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
      position[i3 + 0] = (i % this.WIDTH) / this.WIDTH;
      position[i3 + 1] = ~~(i / this.WIDTH) / this.HIGHT;
      position[i3 + 2] = ~~(i / this.WIDTH) / this.HIGHT;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));


    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.shadowmap,
        {
          vtime: { type: 'f', value: 0 },
          texture: {
            type: 't',
            value: this.generateTexture()
          }
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


  generateTexture(canvasSize = 64) {
    let canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.background = "transparent";
    let context = canvas.getContext('2d');
    let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 8, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, 'transparent');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
    context.fill();
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }



  update(delta) {
    this.mesh.material.uniforms.vtime.value = delta;
  }
}