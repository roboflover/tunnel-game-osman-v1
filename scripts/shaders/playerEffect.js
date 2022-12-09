export const fsPlayerEffect = `

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMixcolA;
uniform vec3 iMixcolB;
varying vec2 vUv;
varying vec3 vPosition;
uniform float toggle;
uniform float iOpacity;

float seed = 0.9; 
const float particles = 100.0; 
float res = 64.0; 
float gravity = 0.0; 



void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;
    //uv += 0.5;
    float clr = 0.0;  
    float timecycle = iTime-floor(iTime);  
    seed = (seed+floor(iTime));
    //testing
    float invres=1.0/res;
    float invparticles = 1.0/particles;

    
    for( float i=0.0; i<particles; i+=1.0 )
    {
		seed+=i+tan(seed);
        vec2 tPos = (vec2(cos(seed),sin(seed)))*i*invparticles;
        
        vec2 pPos = vec2(0.0,0.0);
        pPos.x=((tPos.x) * timecycle);
		pPos.y = -gravity*(timecycle*timecycle)+tPos.y*timecycle+pPos.y;
        
        pPos = floor(pPos*res)*invres; //-----------------------------------------comment this out for smooth version 

    	vec2 p1 = pPos;
    	vec4 r1 = vec4(vec2(step(p1,uv)),1.0-vec2(step(p1+invres,uv)));
    	float px1 = r1.x*r1.y*r1.z*r1.w;
        float px2 = smoothstep(0.0,200.0,(1.0/distance(vec2(uv), pPos)));//added glow
        px1=max(px1,px2);
        
	    clr += px1*(sin(iTime*20.0+i)+1.0);
    }
    vec4 color = vec4(clr*(1.0-timecycle))*vec4(1., 1., 1., 1.0);
    if(toggle == 1.0){
	    fragColor = vec4(vec3(color.rgb*iMixcolA), color.a*iOpacity);
    } else if (toggle == 0.0){
        fragColor = vec4(vec3(color.rgb*iMixcolB), color.a*iOpacity);
    }
}

void main() {
  mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;

export const vsPlayerEffect = `  
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
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos,1.0);
  
}
    `;
