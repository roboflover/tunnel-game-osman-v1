export const fsSmile  = `

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform float iOpacity;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.98,78.233))) * 48.5423);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 4.0;
    pos *= scale;
    return smoothstep(0.6, .5+b*.5, abs((sin(pos.x*2.1415)+b*1.2))*.45);
}

//TRIANGLE WAVE
float tri(float x) {
  return abs(2.0 * fract(x) - 1.0);
}
float triEye(float x) {
  return abs(.6 * fract(x*3.) - .5);
}
// Square
#define SCALE 0.25
vec3 background = vec3(.0, .0,.0);
vec3 foreground = vec3(1.0, 1.0, 1.0);
vec3 square(vec2 uv, float size, vec2 offset) {
  float x = uv.x - offset.x;
  float y = uv.y - offset.y;
  float d = max(abs(x), abs(y)) - size;
  return d > 0. ? background : foreground;
}

vec3 rectangle(vec2 uv, float size, vec2 offset) {
  float x = uv.x - offset.x;
  float y = uv.y - offset.y;
  float d = max(abs(x), abs(y/0.25)) - size;
  return d > 0. ? background : foreground;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  
  vec2 st = fragCoord.xy / iResolution.xy;
  
  vec3 rightUp = square(st / 2. - 0.5, SCALE, vec2(0.0, 0.0));
  
  vec2 stLD = vec2(st.x / 2. - 0., st.y / 2. - .0);
  vec3 leftDown = square(stLD, SCALE, vec2(0.0, 0.0));

  vec2 stLU = vec2(st.x / 2. - 0., st.y / 2. - .0);
  vec3 leftUp = square(stLD, SCALE, vec2(0.0, 0.5));
  
  vec2 stRD = vec2(st.x / 2. - 0.5, st.y / 2. + .50);
  vec3 rightDownD = rectangle(stRD, SCALE, vec2(0.0, 0.565));
  vec3 rightDownU = rectangle(stRD, SCALE, vec2(0.0, 0.687));
  
  // Square RightDown
  vec4 colRDD = vec4(0., 1.0*rightDownD.x, 0., 1.0);
  vec4 colRDU = vec4(1.0*rightDownU.x, 0., 1.0*rightDownU.x, 1.0);
  
  // Radial LeftUp
  vec2 stRadLU = st;
  stRadLU.x -= 0.25;
  stRadLU.y -= .75;
  stRadLU.x *= iResolution.x / iResolution.y;
  float rxLU = tri(length(stRadLU.x*2.) + iTime * 0.);
  float ryLU = tri(length(stRadLU) + iTime * 0.2);
  float rzLU = tri(length(stRadLU) + iTime + 0.6);
  vec4 colRadLU = vec4(0., ryLU, rxLU, 1.0);
  colRadLU.x = fract(4. * colRadLU.x);
  colRadLU.y = fract(4. * colRadLU.y);
  colRadLU = vec4(colRadLU.rgb * leftUp, 1.0);
  
  
  // Radial LeftDown
  vec2 stRadLD = st;
  stRadLD -= 0.25;
  stRadLD.x *= iResolution.x / iResolution.y;
  float rxLD = tri(length(stRadLD) + iTime * 0.6);
  float ryLD = tri(length(stRadLD) + iTime * 0.6);
  float rzLD = triEye(length(stRadLD) + iTime + .5 * 0.6);
  vec4 colRadLD = vec4(rxLD, 0., rzLD, 1.0);
  colRadLD = vec4(colRadLD.rgb * leftDown, 1.0);
  
  // Noise
  st.x = fract(4. * st.x);
  st.x = pow(st.x, st.x);

  float rad = 0.1;
  float bad = 0.1;
  st.y -= fract(sin(iTime) * rad + bad);
  st.x += fract(cos(iTime) * rad + bad);
  vec2 posA = st.yx * vec2(1., 1.);
  vec2 posB = st.xy * vec2(1., 1.);
  float pattern;
  posA = rotate2d(noise(vec2(posA.x * .8 + 1.6, posB.y - .5))) * (posB*2.1);
  posA.x += iTime;
  posA.y += iTime;
  pattern = pow(posB.x, posA.x);
  pattern = lines(posA, 1.1);
  
  st.x = fract(2. * st.x);
  st.y = pow(st.y, st.y);
  vec2 posA2 = st.yx * vec2(1., 1.);
  vec2 posB2 = st.xy * vec2(1., 1.);
  float pattern2;
  posA2 = rotate2d(noise(vec2(posA2.x, posB2.y))) * (posB2 * 2.1);
  posA2.x += iTime;
  posA2.y += iTime;
  pattern2 = pow(posB2.x, posA2.x);
  pattern2 = lines(posA2, 1.1);
  
  vec4 colNoise = vec4(pattern, pattern2, .25, 1.);
  colNoise = vec4(colNoise.rgb * rightUp, 1.0);
  
  // Render
  vec4 final = mix(colNoise * 2., colRadLD * 2., .5);
  final = mix(final * 2., colRadLU * 2., .5);
  final = mix(final * 2., colRDD * 2., .5);
  final = mix(final * 2., colRDU * 2., .5);
  // colRDU
  fragColor = vec4(final.xyz, iOpacity);
  
}

void main() {
    
mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;


export const vsSmile = `  
    float size = 2.;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    
    void main() {
    vNormal = normal;
    vPosition = position;
    vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
    }
    `;
