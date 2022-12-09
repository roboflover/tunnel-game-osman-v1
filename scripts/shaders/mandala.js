export const fsMandala  = `
  // #include <common>
   uniform vec2 iResolution;
   uniform float iTime;
   uniform float iOpacity;
   uniform vec3 iMixcolA;
   uniform vec3 iMixcolB;
   varying vec4 vColor;
   varying vec2 vUv;
   varying vec2 pCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord, float alpha)
{
  float rounLenA = length(sin((gl_FragCoord.xy + gl_FragCoord.xy - iResolution.xy) / iResolution.y * 5.));
  float rounLenB = length(sin((gl_FragCoord.xy + gl_FragCoord.xy - iResolution.xy) / iResolution.y * 20.));
  vec4 pixelMandlA = vec4(sin(iTime * (20. + rounLenA)) > .5);
  vec4 pixelMandlB = vec4(sin(iTime * (2. + rounLenB)) > .15);
  
  vec3 colorNoiseA = vec3(pixelMandlA.rgb);
  
  vec3 colorNoiseB = vec3(pixelMandlB.rgb);
  //colorNoiseA*=colorX;
  //colorNoiseB*=colorY;
  
  // border
  float dist = length(gl_PointCoord - vec2(0.5));
  float borderA = 0.99 - smoothstep(0.46, .5, dist);
  float borderB = 1. - smoothstep(0.455, .48, dist);
  float border = borderA - borderB;
  vec3 newborder = vec3(border * iMixcolB.r, border * iMixcolB.g, border * iMixcolB.b);
  //newborder *= iMixcolB;  
  
  vec4 noisePurple = vec4(iMixcolA, alpha*colorNoiseA*colorNoiseB+border);
  
  // mandala
  vec2 uv = (fragCoord-iResolution.xy/2.)/iResolution.y;
  uv = vec2(length(uv)*(8.+2.*sin(iTime*.1)), sin(atan(uv.x,uv.y)*floor(5.+mod(iTime*.2,6.)) + iTime*.3) );
  uv += sin(uv.yx * (sin(iTime * .3) * 2.) + iTime * .6 * vec2(1, .9));
  vec3 col = vec3(1.);
  //col += 1. - smoothstep(0.1, .2, length(uv - vec2(uv.x, 0)));
  col += 1. - smoothstep(0.2, .3, length(uv - vec2(floor(uv.x + .5), uv.y)));
  col *= .5 + .5 * cos(6.28 * vec3(0, .33, .66) + uv.y + iTime + col * 2.);
  vec4 mandalaBack = vec4(vec3(borderB), alpha-borderB);
  
  fragColor = vec4(vec3(iMixcolA*col), (alpha*colorNoiseA*colorNoiseB)+border);
}
     
void main() {
     
     float dist = length(gl_PointCoord - vec2(0.5));
     float alphaA = 0.99 - smoothstep(0.46, .5, dist);
     float alphaB = 1.19 - smoothstep(0.35, .48, dist);
     float alpha = alphaA-alphaB;
     //gl_FragColor = vec4(iColorA.r, iColorA.g, iColorA.b, psyAlpha);
     mainImage(gl_FragColor, gl_FragCoord.xy, alphaA);
      
}
`;

export const vsMandala = `  
  attribute float size;
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  varying vec2 pCoord;
  varying vec4 vColor;
  
    void main() {
    vColor = vec4(color, 1.);
    pCoord = vec2(position.x, position.y);
    float vSize = size;
    float sizeX = 40.;
    float newTime = iTime*5.;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = vSize*sizeX*(sin(newTime)*0.5+1.3);    
    
    gl_Position = projectionMatrix * mvPosition;
    
    }
    `;
