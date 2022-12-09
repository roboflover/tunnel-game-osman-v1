export const fsBody = `

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
  float sinTime = sin(iTime*0.5) *2.1;
  
  vec2 st = fragCoord.xy / iResolution.xy *2.5;
  
  st.x -= 0.2;
  st.x *= iResolution.x / iResolution.y;
  vec3 color = 0.5 + 0.5 * cos(iTime + st.xyx + vec3(0, 2, 4));
  float d = 0.0;
  st = st * 2. - 1.;
  float sin_factor = sin(iTime / 5.);
  float cos_factor = cos(iTime / 5.);
  d = length(abs(sin(abs(st*2.)+iTime))*(sin(abs(cos(st.x)*sin(st*5.))*.8)/2.));
  float mask = sin(d*50.0);
  
  vec4 ornament = vec4(iMixcolA, .5);
  vec4 colA = vec4(iMixcolB, 1.0);
  vec4 mixColor = mix(ornament, colA, 0.5);
  mixColor = vec4(iMixcolB, st.y*0.2);
  fragColor = vec4(mixColor);


}


void main() {

vec2 uv = vUv;
//mainImage(gl_FragColor, vPosition.xy*vUv*200.1);
mainImage(gl_FragColor, vUv*iResolution.xy);
//vec4 color = vec4(pixelMandlA.r+uv.y-0.2, 0.1, pixelMandlA.b+uv.y-0.4, 1.0);
//gl_FragColor = vec4(color);
}
`;

export const vsBody = `  
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
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      
    }
    `;
