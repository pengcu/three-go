uniform float size;
attribute float offset;
attribute float spd;
attribute vec3 velocity;
uniform float time;
attribute vec3 customColor;
varying float vLight;
varying float vBoost;
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

void main() {
    vec3 noiseVec = position.xyz / 10.0;
    vec3 noiseVec2 = position.xyz / 100.0;
    noiseVec.x += time * 0.3;
    noiseVec2.x += time * 0.1;
    noiseVec.y += time * 0.1;
    // vec3 pos = velocity * sin(time) + position;
    vec3 pos = position;
    pos.y += (noise(noiseVec) - 0.5) * 5.0;
    pos.y += (noise(noiseVec2) - 0.5) * 50.0;
    pos.y += sin(offset + time * spd) * 0.5;
    vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vLight = 0.5 * (cos(mvPosition.x / 10.0 + time + offset) * sin(mvPosition.z / 20.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 2.0)));
    vBoost = .5 * (cos(mvPosition.x / 5.0 + time + offset) * cos(mvPosition.z / 3.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 5.0)));
	gl_PointSize = size * (40.0 / -mvPosition.z);
    gl_PointSize = sqrt(gl_PointSize);
	gl_Position = projectionMatrix * mvPosition;
}