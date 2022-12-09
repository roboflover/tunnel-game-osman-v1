export const fsArc = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolA;
uniform vec3 iMixcolB;
varying vec2 vUv;
varying vec3 vPosition;
uniform float toggle;


float lines( in vec2 pos, float b) {
  float scale = 100.0;
  pos *= scale;
  return smoothstep(0.0,
    .91 + b * .91,
    abs((sin(pos.x * 3.1415) + b * 5.0)) * 1.5);
}

vec4 addbeze( in vec2 uv, float b) {
  uv -= b;
  uv *= vec2(2.1, 5.5);

  mat3 zoom = mat3(
    vec3(.5, 0.0, 1.0),
    vec3(0., 3., 0.0),
    vec3(.25, .25, .0));

  uv = (zoom * vec3(uv, 1.1)).xy * 4.1;

  float y = sqrt(4.4 - ((uv.x * uv.x) * 0.01 + .5));
  float offset = sin(80.0 * uv.x + 3.0);
  float yp = y + offset * sin(iTime * 1.);
  float yn = -y + offset * sin(iTime * 1.);

  vec4 fullcol = vec4(vec3(1.0), 0.);
  float mid = ((yp + yn) * 5.);
  vec4 beze = vec4(1.0) * smoothstep(abs(yp - yn) * 0.6, abs(yp - yn) * .499, abs(uv.y - mid));

  return fullcol * beze;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

  vec2 st = fragCoord.xy / iResolution.xy ;

  float count = sin(iTime)*0.01;
  float countM = sin(iTime)*0.01;
  vec4 beze;
  
  for (int i = 0; i < 9; i++) {
    count += 0.3;
    beze += addbeze(st, count);
  }

  float alpha = beze.x;
  vec3 color;
  if(toggle == 1.){
  color = vec3(st.y,0., 1.);
  } else {
  color = vec3(.9);  
  }
  fragColor = vec4(color, alpha);
}

void main() {
  mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;

export const vsArc = `  
  uniform float iTime;
  uniform float toggle;
  varying vec3 vColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    
    float ration;
    if (toggle == 1.0) {
      ration = 5.;
    } else {
      ration = 0.;
    }
    
    vec3 newpos = position;
    vPosition = newpos;
    newpos.z = mod(  newpos.z + iTime * ration + 100., 500.);
    newpos.y += sin(sin(position.x * 0.5 + 1.5)*2.0);
    newpos.y -= 0.7;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(newpos,1.0);
  
}
    `;
