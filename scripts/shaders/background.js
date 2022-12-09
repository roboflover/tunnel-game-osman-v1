export const fsBackground = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolA;
uniform vec3 iMixcolB;
varying vec2 vUv;
uniform float toggle;

const float PI = 3.14,
  z = 1000.,
  R = 1.;

vec4 draw(vec2 U, vec2 C) {
  return vec4(1.);
}

// start: from https://www.shadertoy.com/view/4djSRW
float hash12(vec2 p)
{
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + (sin(iTime *0.001 + 33.33))*0.1+2. );
  return fract((p3.x + p3.y) * p3.z);
}
// end

void mainImage(out vec4 fragColor, in vec2 u) {

  float ratio;
  float speed;
  if(toggle == .0){
    speed = 1.;
    ratio = 0.1;
  } else {
    speed = 5.;
    ratio = .3;
  }

  vec2 Res = iResolution.xy,
    U = (2. * u - Res) / Res.y;
  fragColor = vec4(vec3(0., 0., sin(iTime*speed)*ratio+ratio), 1.0);
  vec2 U1 = round(U * z / 2.);
  if (hash12(U1) > 0.999) {
    fragColor = draw(U, U1 * 2. / z);
  }
}


void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export const vsBackground = `  
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
