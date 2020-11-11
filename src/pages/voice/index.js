import * as THREE from "three";
import { Basic } from '../base';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

  addObjs() {
    this.uniforms = {
      size: {
        value: 10.0
      },
      time: {
        type: "f",
        value: 0
      }
    }
    this.points = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: v,
      fragmentShader: f,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    let pcount = 500000
    this.geometry = new THREE.BufferGeometry();

    let attrs = {
      offset: new THREE.BufferAttribute(new Float32Array(pcount), 1),
      spd: new THREE.BufferAttribute(new Float32Array(pcount), 1),
      position: new THREE.BufferAttribute(new Float32Array(pcount * 3), 3),
    };

    for (var i = 0; i < pcount; i++) {
      var i3 = i * 3;
      attrs.spd.array[i] = Math.random() + 1.0;
      attrs.offset.array[i] = Math.random();
      attrs.position.array[i3 + 0] = (0.5 - Math.random()) * 10;
      attrs.position.array[i3 + 1] = Math.pow(Math.random(), 8) * 45.5 * (Math.random() > 0.5 ? 1.0 : -1.0);
      attrs.position.array[i3 + 2] = (0.5 - Math.random()) * 10;
    }

    for (let i in attrs) {
      this.geometry.addAttribute(i, attrs[i])
    }

    this.particles = new THREE.Points(this.geometry, this.points);
    this.scene.add(this.particles);
  }

  update() {
    this.points.uniforms.time.value = (Date.now() / 1000) % 10000;
    this.points.needsUpdate = true
  }

}

const v = `
uniform float size;
attribute float offset;
attribute float spd;
attribute vec3 velocity;
uniform float time;
varying float vLight;
varying float vBoost;
varying vec2 vUv;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
    vec3 noiseVec = position.xyz / 10.0;
    vec3 noiseVec2 = position.xyz / 100.0;
    noiseVec.x += time * 0.3;
    noiseVec2.x += time * 0.1;
    noiseVec.y += time * 0.1;
    vec3 pos = position;
    pos.y += (noise(noiseVec) - 0.5) * 5.0;
    pos.y += (noise(noiseVec2) - 0.5) * 50.0;
    pos.y += sin(offset + time * spd) * 0.5;
    vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vLight = 0.5 * (cos(mvPosition.x / 10.0 + time + offset) * sin(mvPosition.z / 20.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 2.0)));
    vBoost = .5 * (cos(mvPosition.x / 5.0 + time + offset) * cos(mvPosition.z / 3.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 5.0)));
	gl_PointSize = size * (40.0 / -mvPosition.z);
    gl_PointSize = sqrt(gl_PointSize);
	gl_Position = projectionMatrix * mvPosition;
}
`

const f = `
varying float vLight;
varying float vBoost;
varying vec2 vUv;
void main() {
    // vec2 lightness = (gl_PointCoord - 0.5) * 10.0;
    // float lt = max(0.0, 1.0 - sqrt((lightness.x * lightness.x) + (lightness.y * lightness.y)));
    // vec3 c = vec3(pow(lt, 3.0), pow(lt, 4.0), pow(lt, 6.0));

    vec3 c;
    
    //gold
    c = vec3(0.5 + 0.5 * pow(vBoost, 2.0), 0.3 + 0.7 * pow(vBoost, 4.0), 0.2 + 0.8 * pow(vBoost, 10.0));
    
    //galaxy
    // c = vec3(1.5 * pow(vBoost, 3.0), 1.5 * pow(vBoost, 4.0), 1.2 * pow(vBoost, 3.0));

    //platium
    // c = vec3(1.5 * pow(vBoost, 2.0), 1.5 * pow(vBoost, 2.5), 1.2 * pow(vBoost, 2.6));

	gl_FragColor = vec4(c, vLight * vLight);
	// gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
}
`


let x = new Voice(document.body)
x.loadAssets().then(x.init)