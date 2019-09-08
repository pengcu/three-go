varying vec2 vUv;
varying float pnoise;

void main() {

    // compose the colour using the UV coordinate
    // and modulate it with the noise like ambient occlusion
    vec3 color = vec3( vUv * ( 2. * pnoise ), 1.0 );
    gl_FragColor = vec4( color.rgb, 1.0 );

}