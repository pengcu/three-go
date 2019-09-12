import * as THREE from 'three'
import Stats from 'stats.js'

class Clock {
  constructor(contain = document.body) {
    // three obj
    this.container = contain
    this.createScene()
    this.createLights()
    this.initStats()
    this.addObjs()
    this.update()
  }

  createScene() {
    this.HEIGHT = window.innerHeight
    this.WIDTH = window.innerWidth
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x090918, 1, 600)
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.WIDTH / this.HEIGHT,
      .1,
      1000
    )

    this.camera.position.x = 0
    this.camera.position.z = 8
    this.camera.position.y = 0
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this.renderer.setClearColor(this.scene.fog.color)
    this.renderer.setSize(this.WIDTH, this.HEIGHT)
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    window.addEventListener('resize', this.handleWindowResize.bind(this), false)
  }

  createLights() {
    let aLight = new THREE.AmbientLight(0xaaaaaa);
    let dLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dLight.position.set(1, 0.2, 0.7).multiplyScalar(2);
    this.scene.add(aLight)
    this.scene.add(dLight)
    dLight.castShadow = true;
    dLight.shadow.mapSize.width = 2048;
    dLight.shadow.mapSize.height = 2048;
    dLight.shadow.radius = 3;
  }

  addObjs() {
    let wallGeo = new THREE.PlaneBufferGeometry(25, 25);
    let wall = new THREE.Mesh(wallGeo, new THREE.MeshPhongMaterial({
      color: 0xeeeeee
    }));
    this.scene.add(wall);
    let clockGroup = new THREE.Group();
    this.scene.add(clockGroup);

    // face

    let faceGeo = new THREE.CircleBufferGeometry(1, 32);
    let faceMat = new THREE.MeshPhongMaterial({
      color: 0x212121
    });
    let face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.3;
    clockGroup.add(face);

    // border

    let circle = new THREE.Shape();
    circle.absarc(0, 0, 1.08, 0, Math.PI * 2);

    let hole = new THREE.Path();
    hole.absarc(0, 0, 1, 0, Math.PI * 2);
    circle.holes.push(hole);

    let tubeExtrudeSettings = {
      curveSegments: 20,
      depth: .4,
      steps: 1,
      bevelEnabled: false
    };
    let tubeGeo = new THREE.ExtrudeGeometry(circle, tubeExtrudeSettings);
    let tubeMat = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    let border = new THREE.Mesh(tubeGeo, tubeMat);
    clockGroup.add(border);

    let center = new THREE.Vector3();

    let handMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc
    });

    // hour ticks

    let hourTickGeo = new THREE.BoxBufferGeometry(.02, .02, .1);
    hourTickGeo.translate(0, 0, .05);

    for (let i = 0; i < 12; i++) {
      let tickMark = new THREE.Mesh(hourTickGeo, handMat);
      let angle = i / 12 * 2 * Math.PI;
      tickMark.position.x = Math.cos(angle) * 0.9;
      tickMark.position.y = Math.sin(angle) * 0.9;
      tickMark.lookAt(center);
      face.add(tickMark);
    }

    // minute ticks

    let minuteTickGeo = new THREE.BoxBufferGeometry(.02, .01, .04);
    minuteTickGeo.translate(0, 0, .02);

    for (let i = 0; i < 60; i++) {
      let tickMark = new THREE.Mesh(minuteTickGeo, handMat);
      let angle = i / 60 * 2 * Math.PI;
      tickMark.position.x = Math.cos(angle) * 0.9;
      tickMark.position.y = Math.sin(angle) * 0.9;
      tickMark.lookAt(center);
      face.add(tickMark);
    }

    // hands

    let handGroup = new THREE.Group();
    handGroup.position.z = 0.04;
    face.add(handGroup);

    let handCenterGeo = new THREE.CylinderBufferGeometry(.03, .03, .1, 32);
    handCenterGeo.rotateX(Math.PI / 2);
    let handCenter = new THREE.Mesh(handCenterGeo, handMat);
    handGroup.add(handCenter);

    let handGeo = new THREE.BoxBufferGeometry(.04, .04, .04);
    handGeo.translate(0, 0.02, 0.02);

    // hour

    this.handHour = new THREE.Mesh(handGeo, handMat);
    this.handHour.scale.y = 12;
    handGroup.add(this.handHour);

    // minute

    this.handMinute = this.handHour.clone();
    this.handMinute.scale.y = 20;
    handGroup.add(this.handMinute);

    // second

    this.handSecond = this.handHour.clone();
    this.handSecond.scale.set(0.5, 21, 0.5);
    handGroup.add(this.handSecond);
    wall.receiveShadow = true;
    face.receiveShadow = true;

    border.castShadow = true;
    handCenter.castShadow = true;
    this.handHour.castShadow = true;
    this.handMinute.castShadow = true;
    this.handSecond.castShadow = true;
  }

  updateTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
      (minute * Math.PI / (6 * 60)) +
      (second * Math.PI / (6 * 60 * 60));
    this.handHour.rotation.z = -hour;

    // minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    this.handMinute.rotation.z = -minute;

    // second
    second = (second * Math.PI / 30);
    this.handSecond.rotation.z = -second;
  }

  initStats() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
  }

  handleWindowResize() {
    this.HEIGHT = window.innerHeight
    this.WIDTH = window.innerWidth
    this.renderer.setSize(this.WIDTH, this.HEIGHT)
    this.camera.aspect = this.WIDTH / this.HEIGHT
    this.camera.updateProjectionMatrix()
  }

  update() {
    this.stats.update()
    this.updateTime()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => {
      this.update()
    })
  }
}
new Clock()
