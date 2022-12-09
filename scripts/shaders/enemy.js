//float rounLen = length(sin((fragCoord + fragCoord - iResolution.xy) / iResolution.y * 5.));
//vec4 pixelMandlA = vec4(sin(iTime * (10. + rounLen)) > .5);

export const fsEnemy  = `
  // #include <common>
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float iOpacity;
  uniform vec3 iMixcolB;
  uniform vec3 iMixcolA;
  varying vec3 vColor;
  varying vec2 vUv;
  varying vec2 pCoord;
  varying float vSize;

void mainImage(out vec4 fragColor, in vec2 fragCoord, float alpha)
{
  float iSin = sin(iTime)*0.5+12.;
  float newTime = iTime;
  //vec3 vColor = color;
  vec2 newres = vec2(1.0, 1.0);
  
  float rounLen = length(sin((fragCoord.xy + fragCoord.xy - newres.xy) / newres.y * 3.));
  vec4 pixelMandlA = vec4(sin(iSin * (20. + rounLen)) > .5);
  
  vec3 colorNoise = vec3(pixelMandlA.rgb * iMixcolA);
  colorNoise=colorNoise*vColor;
  float speedX = 2.5;
  colorNoise.r*=sin(newTime* speedX*5.)*0.5+0.8;
  colorNoise.g*=sin(iTime+1.5* speedX*0.5)*0.5+1.5;
  colorNoise.b*=sin(iTime+2.0* speedX*2.)*0.5+.85;
  
  // border
  float dist = length(fragCoord - vec2(0.5));
  float borderA = 0.97 - smoothstep(0.49, .5, dist);
  float borderB = 1. - smoothstep(0.35, .48, dist);
  float border = borderA-borderB;
  vec3 newborder = vec3(border*iMixcolB.r, border*iMixcolB.g, border*iMixcolB.b);
  newborder*=iMixcolB;
  
  fragColor = vec4(vec3(colorNoise+newborder), alpha);
  //fragColor = vec4(vec3(pixelMandlA.rgb), 1.);


}
     
void main() {
  //vec2 vUv = gl_PointCoord - vec2(0.5);
  float dist = length(gl_PointCoord - vec2(0.5));
  float alphaA = 0.99 - smoothstep(0.46, .5, dist);
  //float alphaB = 1. -smoothstep(0.35, .48, dist);
  //float alpha = alphaA-alphaB;

  mainImage(gl_FragColor, vUv*iResolution, alphaA);
  //gl_FragColor = vec4(1.0);
}
`;

export const vsEnemy = ` 

  attribute float size;
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  varying vec2 pCoord;
  varying vec3 vColor;
  varying float vSize;
  
    void main() {
    
    vUv = uv;
    vColor = color;
    pCoord = vec2(position.x, position.y);
    vSize = size;
    
    vec3 newPos = position;
    float sinnX;
    float sinnY;
    float zet = 0.2;
    sinnX += sin(iTime + position.x * zet);
    sinnY += sin(iTime + position.y * zet);
    newPos.z = (sinnX * sinnY) * 5.8;

    vec3 nPos = position;
    float one;
    one  = cos(iTime * 1.000 + distance(vUv, vec2(0.0, 0.0)) * 8.0) * 0.5 + 0.5;
    one += cos(iTime * 0.666 + distance(vUv, vec2(1.0, 0.0)) * 8.0) * 0.5 + 0.5;
    one += cos(iTime * 0.777 + distance(vUv, vec2(0.5, 1.3)) * 8.0) * 0.5 + 0.5;
    one = one / 3.0;
    nPos = vec3(position.x, position.y, one+position.z);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float pnewSX = abs(sin((iTime * position.x) * 0.05)) + .11;
    float pnewSY = abs(sin((iTime * position.y) * 0.05)) + .11;
    float pnew = (pnewSX + pnewSY) * 0.5;
    float gps = 10. * (1.5 / - mvPosition.z) * vSize*(one+3.);
    
    float r = 0.5;
    float a = pow(r, 2.0);
    float b = sin(r * 0.8 - 1.6);
    float c = sin(r - 0.010);
    float ss = sin(a - iTime * 3.0 + b) * c;
    
    gl_PointSize = gps * (ss * 1.5+2.);    
    
    gl_Position = projectionMatrix * mvPosition;
    
    }
    `;
