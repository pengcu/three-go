void main() {
    gl_PointSize = 4. + 2. * sin(position.y / 4.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}