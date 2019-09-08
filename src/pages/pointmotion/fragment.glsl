varying float vLight;
varying float vBoost;
varying vec2 vUv;
void main() {
    // vec2 lightness = (gl_PointCoord - 0.5) * 10.0;
    // float lt = max(0.0, 1.0 - sqrt((lightness.x * lightness.x) + (lightness.y * lightness.y)));
    // vec3 c = vec3(pow(lt, 3.0), pow(lt, 4.0), pow(lt, 6.0));

    vec3 c;
    
    //gold
    c = vec3(0.5 + 0.5 * pow(vBoost, 2.0), 0.3 + 0.7 * pow(vBoost, 4.0), 0.2 + 0.8 * pow(vBoost, 10.0));
    
    //galaxy
    // c = vec3(1.5 * pow(vBoost, 3.0), 1.5 * pow(vBoost, 4.0), 1.2 * pow(vBoost, 3.0));

    //platium
    // c = vec3(1.5 * pow(vBoost, 2.0), 1.5 * pow(vBoost, 2.5), 1.2 * pow(vBoost, 2.6));

	gl_FragColor = vec4(c, vLight * vLight);
	// gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
}