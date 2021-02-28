uniform float vtime;
attribute float size;
varying float vLight;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (30.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}