import * as THREE from "three";

export class G {
    constructor() {
        this.container = new THREE.Object3D();
    }

    init() {
        this.createG()
    }

    loadTexture() {
        return new Promise(reslove => {
            new THREE.TextureLoader().load("https://github.githubassets.com/images/modules/site/home/globe/map.png", reslove);
        })
    }

    getImageData(t) {
        const e = document.createElement("canvas").getContext("2d");
        return e.canvas.width = t.width,
            e.canvas.height = t.height,
            e.drawImage(t, 0, 0, t.width, t.height),
            e.getImageData(0, 0, t.width, t.height)
    }

    test(geo) {

    }

    async createG() {
        const x = await this.loadTexture();
        const i = this.getImageData(x.image);
        const texture = new THREE.Texture(i);
        console.log(i)
        const geometry = new THREE.IcosahedronGeometry(150, 4);
        const material = new THREE.MeshPhongMaterial({ color: '#1826ef', map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        const customMaterial = new THREE.ShaderMaterial(
            {
                uniforms: {},
                vertexShader: `
                varying vec3 vNormal;
                void main() 
                {
                    vNormal = normalize( normalMatrix * normal );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
                fragmentShader: `
                varying vec3 vNormal;
                void main() 
                {
                    float intensity = pow( 0.3 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); 
                    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
                }`,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

        var ballGeometry = new THREE.IcosahedronGeometry(200, 4);
        var ball = new THREE.Mesh(ballGeometry, customMaterial);
        this.container.add(ball);
        this.container.add(sphere)
        this.container.position.y = 100

    }
}