import * as THREE from "three";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { Basic } from '../base';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import s from '../../obj/dagger.obj';

class Voice extends Basic {
  constructor(container, options = {}) {
    super(container);
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;
    this.camera.position.z = 180;
    this.camera.position.y = 0;
    this.camera.position.x = 0;

    this.addObjs()
  }

  loadAssets() {
    const texture = new THREE.TextureLoader();
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
      }
    }
    this.textures.map.val.offset.x = 0
    this.textures.map.val.offset.y = 0
    return Promise.resolve()
  }

  addObjs() {
    const objLoader = new OBJLoader2()
    objLoader.load(s, obj => {
      obj.traverse(child => {
        console.log(child)
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshPhongMaterial({
            map: this.textures.map.val,
            specularMap: this.textures.specularMap.val,
            emissiveMap: this.textures.emissiveMap.val
          })
          child.scale.set(2, 2, 2)
        }
      });
      this.scene.add(obj)
    })
  }

  update() {

  }

}

const v = `

`

const f = `

`


let x = new Voice(document.body)
x.loadAssets().then(x.init)