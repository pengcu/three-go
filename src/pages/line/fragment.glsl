precision highp float;

uniform float time;
varying vec2 vUv;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main( void ) {
    // vec2 position = vUv * 1.0 - 0.5;
    // float dist = sqrt(position.x * position.x + position.y * position.y);
    // float q = 1.0 - dist; //vignet
    // float deg = sin(atan(position.x, position.y) + time / 12.0);
    // vec3 nvec = vec3(deg * 3.0 + time * 2.0, deg * .2 + time * .3 + deg, 1.0);
    // float r = pow(1.3 - noise(nvec), 2.0) * pow(q, 1.0);
    // r *= q;
    // gl_FragColor = vec4( pow(r, 1.0), pow(r, 4.0), pow(r, 8.0), r );

    vec2 position = vUv;
    position.x += -0.4 * position.y;
    vec3 nvec = vec3(position.x * 20.0 + time * 0.1, time * 0.2, time * 0.4);
    vec3 nvechigh = vec3(position.x * 400.0 + time * 0.1, time * 0.2 + position.y * 2.0, time * 0.4);
    vec3 nvecy = vec3(vUv.x * 10.0 + time * 0.2, position.y, time * 0.3);
    // float dist = sqrt(position.x * position.x + position.y * position.y);
    // float q = 1.0 - dist; //vignet
    float r = noise(nvec) * (1.0 - noise(nvecy)) * 0.8;
    r += pow(noise(nvechigh), 4.0) * 0.5;
    // r *= q;
    gl_FragColor = vec4( pow(r, 2.0), 0.05 + pow(r, 4.0), pow(r, 8.0), 1.0 );


}