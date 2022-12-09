export const fsStars = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolB;
uniform vec3 iMixcolA;
uniform float toggle;
#define EPSILON 0.01
varying vec2 vUv;

void main() {

vec2 uv = vUv;
 
uv.y -= iTime*0.006;
  if ((fract(uv.x * 10.0) < EPSILON) ||
    (fract(uv.y * 50.0) < EPSILON)) {
    gl_FragColor = vec4(iMixcolB, 1.0);
  } else {
    gl_FragColor = vec4(iMixcolA, 1.0);
  }
  
//gl_FragColor = vec4(vec3(1.0), 1.0);  
}
`;

export const vsStars = `  
    uniform float iTime;
    varying vec3 vColor;
    varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 newpos = position;
        //newposnewpos += vec3(newpos.x, newpos.y, newpos.z*sin(iTime));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
      
    }
    `;
