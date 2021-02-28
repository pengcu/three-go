import * as THREE from "three";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { Basic } from '../base';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import s from '../../obj/dagger.obj';



/**
 * 1. 
 * mask 效果
 * 2. map color
 */
class Dagger extends Basic {
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
      },
      aoMap: {
        url: "https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_mask.png",
        val: texture.load("https://models.babylonjs.com/Demos/weaponsDemo/textures/moltenDagger_mask.png")
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
          alphaMap: this.textures.alphaMap.val,
          aoMap: this.textures.aoMap.val
        })
        child.scale.set(4, 4, 4)
      }
    });
    this.obj.position.y = 200
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
          child.material = new THREE.MeshPhongMaterial({
            map: this.textures.map.val,
            specularMap: this.textures.specularMap.val,
            emissiveMap: this.textures.emissiveMap.val,
            alphaMap: this.textures.alphaMap.val,
            aoMap: this.textures.aoMap.val
          })

          child.material.specular = new THREE.Color(0x00ffff);
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