export const fsZnak = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolA;
uniform vec3 iMixcolB;
varying vec2 vUv;
varying vec3 vPosition;
uniform float toggle;
//uniform sampler2D iChannel0;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  //vec3 c = texture2D(iChannel0, fragCoord / iResolution.xy).rgb;
  float rounLen = length(round((fragCoord + fragCoord - iResolution.xy) / iResolution.y * 5.));
  vec4 pixelMandlA = vec4(sin(iTime * (1. + rounLen)) > .5);
  vec4 pixelMandlB = vec4(sin(iTime * 10.5 * (.5 + rounLen)) > .1);
  vec3 colorA = pixelMandlA.rgb*iMixcolA;
  vec3 colorB = pixelMandlB.rgb*iMixcolB;
  fragColor = vec4(vec3(colorB+colorA), colorA);
}

void main() {
  mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;

export const vsZnak = `  

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
    //newpos.z = mod(  newpos.z + iTime * ration + 100., 500.);
    //newpos.y += sin(sin(position.x * 0.5 + 1.5)*2.0);
    //newpos.y -= 0.7;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  
}
    `;
