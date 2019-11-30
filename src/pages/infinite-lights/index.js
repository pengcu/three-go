import { App } from "./App";
import * as THREE from "three";


const distortion_uniforms = {
  uFreq: new THREE.Uniform(new THREE.Vector4(4, 8, 8, 1)),
  uAmp: new THREE.Uniform(new THREE.Vector4(25, 5, 10, 10))
};

const distortion_vertex = `
uniform vec4 uFreq;
        uniform vec4 uAmp;
        float nsin(float val){
        return sin(val) * 0.5+0.5;
        }
    
				#define PI 3.14159265358979
        float getDistortionX(float progress){
            return 
                    (
                        cos( PI * progress * uFreq.r + uTime) * uAmp.r +
                        pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)),2. )* uAmp.g
                    
                    );
        }
        float getDistortionY(float progress){
            return 
                    (
                        -nsin( PI * progress * uFreq.b + uTime) * uAmp.b +
                        -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a) ),5.) * uAmp.a
                    
                    );
        }
        vec3 getDistortion(float progress){
            return vec3(
                getDistortionX(progress)-getDistortionX(0.0125) ,
                getDistortionY(progress)- getDistortionY(0.0125),
                0.
            );
        }
`;

const myCustomDistortion = {
  uniforms: distortion_uniforms,
  getDistortion: distortion_vertex
};

const options = {
  onSpeedUp: (ev) => {
  },
  onSlowDown: (ev) => {
  },
  // mountainDistortion || LongRaceDistortion || xyDistortion || turbulentDistortion || turbulentDistortionStill || deepDistortionStill || deepDistortion
  distortion: myCustomDistortion,

  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,

  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,

  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,

  // Percentage of the lane's width
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,

  /*** These ones have to be arrays of [min,max].  ***/
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],

  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],

  /****  Anything below can be either a number or an array of [min,max] ****/

  // Length of the lights. Best to be less than total length
  carLightsLength: [400 * 0.03, 400 * 0.2],
  // Radius of the tubes
  carLightsRadius: [0.05, 0.14],
  // Width is percentage of a lane. Numbers from 0 to 1
  carWidthPercentage: [0.3, 0.5],
  // How drunk the driver is.
  // carWidthPercentage's max + carShiftX's max -> Cannot go over 1. 
  // Or cars start going into other lanes 
  carShiftX: [-0.8, 0.8],
  // Self Explanatory
  carFloorSeparation: [0, 5],

  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    /***  Only these colors can be an array ***/
    leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
    rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
    sticks: 0x03B3C3,
  }
};

const container = document.getElementById("app");
const myApp = new App(container, options);
myApp.loadAssets().then(myApp.init);