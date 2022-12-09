export const fsTunnel = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolB;
uniform vec3 iMixcolA;
varying vec3 vNormal;
varying vec3 vPosition;

#define EPSILON 0.04
varying vec2 vUv;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

  float sinTime = sin(iTime) +80.;
  float rounLen = length(sin((fragCoord.xy + fragCoord.xy - iResolution.xy) / iResolution.x * 5.));
  vec4 pixelMandlA = vec4(sin(sinTime * (10. + rounLen)) > .15);
  vec3 colorNoise = vec3(pixelMandlA.rgb);
  vec3 newNormal = vec3(vNormal*0.5+0.9*iMixcolA);
  
  vec3 colorUv = vec3(newNormal.r*vUv.y-.4, newNormal.g*vUv.y-.2, newNormal.b*vUv.y-.2);
  

  fragColor = vec4((colorNoise*0.2)+colorUv, 1.);


}


void main() {

vec2 uv = vUv;
mainImage(gl_FragColor, gl_FragCoord.xy*vUv);
//vec4 color = vec4(pixelMandlA.r+uv.y-0.2, 0.1, pixelMandlA.b+uv.y-0.4, 1.0);
//gl_FragColor = vec4(color);
}
`;

export const vsTunnel = `  
    uniform float iTime;
    varying vec3 vColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

      void main() {
      vNormal = normal;
      vPosition = position;
        vUv = uv;
        vec3 newpos = position;
      float newTime = sin(iTime*3.);  
        float sinnX;
        float sinnY;
        float sinnZ;
        float aaa = 3.0;
        sinnX = cos(newTime + position.y * aaa);
        sinnY = cos(newTime + position.z * aaa);
        sinnZ = sin(newTime + position.y * aaa);
        newpos.x += sinnX;
        newpos.y += sinnY;
        newpos.z += sinnZ;
        
        float sinxyz = sin(iTime) *1.1;
        //newpos = vec3(newpos.x, newpos.y, newpos.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
      
    }
    `;
