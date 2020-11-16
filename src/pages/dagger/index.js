import * as THREE from "three";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { Basic } from '../base';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import s from '../../obj/dagger.obj';

class Dagger extends Basic {
  constructor(container, options = {}) {
    super(container);
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;
    this.camera.position.z = 180;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
  }

  loadAssets() {
    const texture = new THREE.TextureLoader();
    const objLoader = new OBJLoader2();
    this.textures = {
      specularMap: {
        url: "https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_specular.png",
        val: texture.load("https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_specular.png")
      },
      map: {
        url: "https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_diffuse.png",
        val: texture.load("https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_diffuse.png")
      },
      emissiveMap: {
        url: "https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_emissive.png",
        val: texture.load("https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_emissive.png")
      },
      alphaMap: {
        url: "https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_gloss.png",
        val: texture.load("https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_gloss.png")
      }
    }

    return new Promise((resolve, reject) => {
      objLoader.load(s, obj => {
        this.obj = obj
        resolve()
      })
    })
  }

  addObjs() {
    this.obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: this.textures.map.val,
          specularMap: this.textures.specularMap.val,
          emissiveMap: this.textures.emissiveMap.val,
          alphaMap: this.textures.alphaMap.val
        })
        child.material.specular = new THREE.Color(0x00ffff);
        child.scale.set(2, 2, 2)
      }
    });
    this.scene.add(this.obj)
  }

  init() {
    this.addObjs()
    this.tick()
  }

  update() {
    this.obj.rotation.y += 0.01
    if (this.obj.rotation.y > 3) {
      this.obj.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color(0xddd12d);
        }
      });
    }
  }

}

const v = `

`

const f = `

`


let x = new Dagger(document.body)
x.loadAssets().then(x.init)