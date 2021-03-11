varying vec3 vLight;
void main(){
    gl_FragColor = vec4(vLight.xyz,1.0);
}