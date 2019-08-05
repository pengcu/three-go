import * as THREE from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'


import overwatch from '../../obj/overwatch.json'

class Light {
  constructor(contain = document.body) {
    this.container = contain;
    this.createScene();
    this.createLights();
    this.initStats();
    this.addObjs();
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;
    this.update();
  }
  createScene() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    // 创建场景
    this.scene = new THREE.Scene();
    // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
    this.scene.fog = new THREE.Fog(0x090918, 1, 600);
    // 创建相机
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

    // 设置相机的位置
    this.camera.position.x = 0;
    this.camera.position.z = 200;
    this.camera.position.y = 0;
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      // 在 css 中设置背景色透明显示渐变色
      alpha: true,
      // 开启抗锯齿
      antialias: true
    });
    // 渲染背景颜色同雾化的颜色
    this.renderer.setClearColor(this.scene.fog.color);
    // 定义渲染器的尺寸；在这里它会填满整个屏幕
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    // 打开渲染器的阴影地图
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // 在 HTML 创建的容器中添加渲染器的 DOM 元素
    this.container.appendChild(this.renderer.domElement);

    // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
    window.addEventListener('resize', this.handleWindowResize.bind(this), false);
  }
  createLights() {
    // 户外光源
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    // 环境光源
    this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // 设置光源的位置方向
    this.shadowLight.position.set(50, 50, 50);

    // 开启光源投影
    this.shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    this.shadowLight.shadow.mapSize.width = 2048;
    this.shadowLight.shadow.mapSize.height = 2048;

    // 为了使这些光源呈现效果，需要将它们添加到场景中
    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);
  }
  addObjs() {
    let objLoader = new THREE.ObjectLoader()
    objLoader.load(overwatch, (o) => {
      var cubeMaterial3 = new THREE.MeshPhongMaterial({ color: 0xccddff, envMap: this.getTexture(), refractionRatio: 0.98, reflectivity: 0.9 });
      console.log(o)
      o.geometry.computeVertexNormals();
      var s = 1.5;
      var mesh = new THREE.Mesh(o.geometry, cubeMaterial3);
      mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
      this.scene.add(mesh);
    })
  }

  getTexture(canvasSize = 64) {
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


  initStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  handleWindowResize() {
    // 更新渲染器的高度和宽度以及相机的纵横比
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.stats.update();
    TWEEN.update();
    // 渲染器执行渲染
    this.renderer.render(this.scene, this.camera);
    // 循环调用
    requestAnimationFrame(() => {
      this.update()
    });
  }
}
new Light()
