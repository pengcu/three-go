import * as THREE from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Audio {
  constructor(contain = document.body) {
    // audio obj
    this.numberOfBars = 60;
    this.bars = [];
    // three obj
    this.container = contain;
    this.createScene();
    this.createLights();
    this.initStats();
    this.addObjs();
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;
    this.setupAudioProcessing()
  }
  createScene() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x090918, 1, 600);
    let aspectRatio = this.WIDTH / this.HEIGHT;
    let fieldOfView = 60;
    let nearPlane = 1;
    let farPlane = 10000;
    /**
     * PerspectiveCamera 透视相机
     * @param fieldOfView 视角
     * @param aspectRatio 纵横比
     * @param nearPlane 近平面
     * @param farPlane 远平面
     */
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    this.camera.position.x = 0;
    this.camera.position.z = 50;
    this.camera.position.y = 0;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleWindowResize.bind(this), false);
    window.addEventListener('drop', this.handleDropFiles.bind(this), false);
    window.addEventListener("dragover", function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, false);
  }
  createLights() {
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);

    this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    this.shadowLight.position.set(50, 50, 50);

    this.shadowLight.castShadow = true;

    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;

    this.shadowLight.shadow.mapSize.width = 2048;
    this.shadowLight.shadow.mapSize.height = 2048;

    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  createBars() {
    for (let i = 0; i < this.numberOfBars; i++) {

      //create a bar
      let barGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

      //create a material
      let material = new THREE.MeshPhongMaterial({
        color: this.getRandomColor(),
        specular: 0xffffff
      });

      //create the geometry and set the initial position
      this.bars[i] = new THREE.Mesh(barGeometry, material);
      this.bars[i].position.set(i - this.numberOfBars / 2, 0, 0);

      //add the created bar to the scene
      this.scene.add(this.bars[i]);
    }
  }

  addObjs() {
    this.createBars()
  }


  setupAudioProcessing() {
    //get the audio context
    this.audioContext = new AudioContext();

    //create the javascript node
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.audioContext.destination);

    //create the source buffer
    this.sourceBuffer = this.audioContext.createBufferSource();

    //create the analyser node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 512;

    //connect source to analyser
    this.sourceBuffer.connect(this.analyser);

    //analyser to speakers
    this.analyser.connect(this.javascriptNode);

    //connect source to analyser
    this.sourceBuffer.connect(this.audioContext.destination);


    //this is where we animates the bars
    this.javascriptNode.onaudioprocess = () => {

      // get the average for the first channel
      let array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);

      //render the scene and update controls
      this.update();

      let step = Math.round(array.length / this.numberOfBars);

      //Iterate through the bars and scale the z axis
      for (let i = 0; i < this.numberOfBars; i++) {
        let value = array[i * step] / 4;
        value = value < 1 ? 1 : value;
        this.bars[i].scale.y = value;
      }
    }

  };
  start(buffer) {
    this.audioContext.decodeAudioData(buffer, (decodedBuffer) => {
      this.sourceBuffer.buffer = decodedBuffer
      this.sourceBuffer.start(0);
    }, () => { });
  };

  initStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  handleDropFiles(event) {
    event.stopPropagation();
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let fileResult = e.target.result;
      this.start(fileResult);
    };

    fileReader.onerror = () => {
      console.error('something wrong about audio')
    };

    fileReader.readAsArrayBuffer(file);
  }

  update() {
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    // requestAnimationFrame(() => {
    //   this.update()
    // });
  }
}
new Audio()
