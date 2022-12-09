export const fsHorror  = `

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
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
  
  float iSinus = sin(iTime)*0.5+5.;
  
  vec2 st = fragCoord.xy / iResolution.xy;
  
  // CREATE MASKS
  
  vec3 rightUp = square(st / 2. - 0.5, SCALE, vec2(0.0, 0.0));
  
  vec2 stLD = vec2(st.x / 2. - 0., st.y / 2. - .0);
  vec3 leftDown = square(stLD, SCALE, vec2(0.0, 0.0));

  vec2 stLU = vec2(st.x / 2. - 0., st.y / 2. - .0);
  vec3 leftUp = square(stLU, SCALE, vec2(0.0, 0.5));
  
  vec2 stRD = vec2(st.x / 2. - 0.5, st.y / 2. + .50);
  vec3 rightDownD = rectangle(stRD, SCALE, vec2(0.0, 0.565));
  vec3 rightDownU = rectangle(stRD, SCALE, vec2(0.0, 0.687));
  
  // Square RightDown
  float sinRDD = sin(iTime*60.)*1.1+1.1;
  vec3 o1RDD = vec3(0., 0.9, 0.8);
  vec3 o2RDD = vec3(1., 0., 1.1);
  vec3 omix1RDD = mix(o1RDD, o2RDD, sinRDD);
  vec3 omix2RDD = mix(o2RDD, o1RDD, sinRDD);
  vec4 colRDD = vec4(vec3(omix1RDD*rightDownD), 1.);
  vec4 colRDU = vec4(vec3(omix2RDD*rightDownU), 1.);
  
  // Radial  RightUp
  float iSinusRU = iSinus*3. + 3.;
  vec2 uvRU = (fragCoord - iResolution.xy / 2.) / iResolution.y;
  uvRU.x -= .25;
  uvRU.y -= .25;
  uvRU = vec2(length(uvRU) * (sin(5.)+sin(iTime*5.)*20.+40.), sin(atan(uvRU.x, uvRU.y) * floor(mod(0.2, 1.5))));
  uvRU += sin(uvRU.yx * (sin(50. * 2.93) * 5.) + 1. * 4.6);
  vec3 colA = vec3(1.);
  colA *= .5 + .5 * cos(uvRU.y + 2.);
  colA = vec3(colA.r, colA.r, 0.);
  vec3 colB = vec3(1.);
  colB *= .5 + .5 * cos(uvRU.y + iSinusRU);
  colB = vec3(0., colA.r, colB.r);
  vec3 col = mix(colA, colB, sin(iTime*10.));
  col += fract(col);
  vec4 colRadRU = vec4(0.);
  colRadRU = vec4(0., col.g * rightUp.r, 0., 1.0);
  
  // Radial LeftUp
  vec2 stRadLU = st;
  stRadLU.x -= 0.25;
  stRadLU.y -= .75;
  stRadLU.x *= iResolution.x / iResolution.y;
  float rxLU = tri(length(stRadLU) + iSinus * 10.2 + 2.);
  float ryLU = tri(length(stRadLU) + iSinus * 3.2);
  float rzLU = tri(length(stRadLU) + iSinus * 1.2 + 4.);
  vec4 colRadLU = vec4(ryLU, rxLU, rzLU, 1.0);
  // colRadLU.x = fract(4. * colRadLU.x);
  colRadLU.y = fract(0.9 * colRadLU.y);
  ////
  vec2 uvLU = (fragCoord - iResolution.xy / 2.) / iResolution.y;
  uvLU.x += 0.25;
  uvLU.y -= .25;
  uvLU = vec2(length(uvLU) * (sin(5.) + sin(iTime * 5.) * 5. + 15.), sin(atan(uvRU.x, uvRU.y) * floor(mod(0.2, 1.5))));
  uvLU += sin(uvLU.yx * (sin(50.) * 5.+20.) + 1. * 4.6);
  vec3 colRUA = vec3(1.);
  colRUA *= .5 + .5 * cos(uvLU.y + 2.);
  colRUA = vec3(0.0, colRUA.r, 0.);
  vec3 colRUB = vec3(1.);
  colRUB *= .5 + .5 * cos(uvLU.y + iSinusRU);
  colRUB = vec3(0., 0.3, colRUB.r);
  vec3 colRU = mix(colRUA, colRUB, sin(iTime * 10.)*0.5+0.9);
  colRU += fract(colRU);  
  colRadLU = vec4(colRU * leftUp, 1.0);  
  
  // Radial LeftDown
  vec2 stRadLD = st;
  stRadLD -= 0.25;
  stRadLD.x *= iResolution.x / iResolution.y;
  float rxLD = tri(length(stRadLD) + iSinus * 3.6);
  float ryLD = tri(length(stRadLD) + iSinus * 10.);
  float rzLD = triEye(length(stRadLD) + iSinus + 1.5 * 0.6);
  vec4 colRadLD = vec4(rxLD, rxLD, rzLD, 1.0);
  
  /////
  
  vec2 stPatLD = fragCoord.xy / iResolution.xy *2.;
  float dLD = 0.0;
  stPatLD = stPatLD * 2. - 1.;
  float sin_factor = sin(iTime / 5.);
  float cos_factor = cos(iTime / 5.);
  dLD = length(abs(sin(abs(stPatLD * 2.) + iTime)) * (sin(abs(cos(stPatLD.x) * sin(stPatLD * 5.)) * .8) / 2.));
  float mask = sin(dLD * 50.0);
  vec3 ornament = vec3(mask);
  colRadLD = vec4(colRadLD.rbg * leftDown*ornament*1.6, 1.0);
  
  // Render
  vec4 final;
  final = mix(final * 2., colRadLD * 2., .5);
  final = mix(final * 2., colRadRU * 2., .5);
  final = mix(final * 2., colRadLU * 2., .5);
  final = mix(final * 2., colRDD * 2., .5);
  final = mix(final * 2., colRDU * 2., .5);
  // colRDU
  fragColor = vec4(final.xyz, 1.);
  //fragColor = vec4(col, 1.);
}

void main() {
    
mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;


export const vsHorror = `  
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
