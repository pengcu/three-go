varying vec3 vLight;
uniform float vtime;
void main(){
    gl_FragColor = vec4(vLight.xy,sin(vtime),1.0);
}