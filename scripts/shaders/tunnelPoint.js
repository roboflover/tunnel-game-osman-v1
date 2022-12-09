export const fsTunnelPoint  = `
  // #include <common>
   uniform vec2 iResolution;
   uniform float iTime;
   uniform float iOpacity;
   uniform vec3 iColorA;
   uniform vec3 iColorB;
   varying vec4 vColor;
   varying vec2 vUv;
   varying vec2 pCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord, float alpha)
{
  fragColor = vec4(iColorA*vColor.rgb, alpha*iOpacity);
}
     
     void main() {
     
     float dist = length(gl_PointCoord - vec2(0.5));
     float alphaA = 0.99 - smoothstep(0.46, .5, dist);
     float alphaB = 1.19 - smoothstep(0.43, .48, dist);
     float alpha = alphaA-alphaB;
     //gl_FragColor = vec4(iColorA.r, iColorA.g, iColorA.b, alpha);
     mainImage(gl_FragColor, gl_FragCoord.xy, alpha);
      
}
`;

export const vsTunnelPoint = `  
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
    
    vec4 mvPosition = modelViewMatrix * vec4(nPos, 1.0);
    float pnewSX = abs(sin((iTime * position.x) * 0.05)) + .11;
    float pnewSY = abs(sin((iTime * position.y) * 0.05)) + .11;
    float pnew = (pnewSX + pnewSY) * 0.5;
    float gps = 10. * (1.5 / - mvPosition.z) + vSize*(one+3.);
    
    float r = 0.5;
    float a = pow(r, 2.0);
    float b = sin(r * 0.8 - 1.6);
    float c = sin(r - 0.010);
    float ss = sin(a - iTime * 3.0 + b) * c;
    
    gl_PointSize = gps * (ss * 1.5+2.);    
    
    gl_Position = projectionMatrix * mvPosition;
    
    }
    `;
