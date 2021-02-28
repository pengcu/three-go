varying float vLight;
void main(){
    gl_FragColor = vec4(vLight*vLight,1.0,0.0,1.0);
}