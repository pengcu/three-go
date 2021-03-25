varying float vLight;
uniform float vtime;
void main(){
    vec3 colorA = vec3(0.149,0.141,0.912);
    vec3 colorB = vec3(1.000,0.833,0.224);
    vec3 color = vec3(0.0);

    float pct = abs(sin(vtime));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}