varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( 
        position.xyz
        , 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}