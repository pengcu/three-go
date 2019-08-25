import * as THREE from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as vertex from './vertex.glsl'
import * as fragment from './fragment.glsl'


class Point {
  constructor(contain = document.body) {
    this.container = contain;
    this.createScene();
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
    this.container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.handleWindowResize.bind(this), false);
  }
  addObjs() {
    let geo = new THREE.PlaneGeometry(300, 300, 2, 2);

    this.uniforms = {
      time: {
        type: "f",
        value: 0
      }
    }
    this.points = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex.default,
      fragmentShader: fragment.default,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    var mesh = new THREE.Mesh(geo, this.points);

    this.scene.add(mesh);
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

  motionPoints() {
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
    // 渲染器执行渲染
    this.points.uniforms.time.value = (Date.now() / 1000) % 10000;
    this.points.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
    // 循环调用
    requestAnimationFrame(() => {
      this.update()
    });
  }
}
new Point()
