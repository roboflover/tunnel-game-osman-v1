import * as THREE from '.././lib/three.module.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsTunnel, vsTunnel } from '.././shaders/tunnel.js'

export class Tunnel {
  constructor(tunnelMeshes, tunnelData) {
    this.tunnelData = tunnelData
    this.tunnelMeshes = tunnelMeshes
    
    
    const loader = new THREE.TextureLoader();
    // const texture = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/bayer.png');
    // texture.minFilter = THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.tunnelB },
      iMixcolA: { value: cnfgColor.tunnelA },
      //iChannel0: { value: texture },
    }
    
    
  }

  randTime() { 
    return 1.0
  }

  setParam() {
    const data = {
      velocity: new THREE.Vector3(.0, .0, .0),
      time: 1,
      dead: false
    }
    return data
  }
  
  createTunnel(){
    const geoCyl = new THREE.CylinderBufferGeometry(
       10, 1, 30, 100, 500, true,)
    //console.log(geoCyl) 
    const matCyl = new THREE.MeshBasicMaterial({ 
      color: "green",
      side: THREE.DoubleSide,
      wireframe: true
      })
      
    const matshader = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsTunnel,
      fragmentShader: fsTunnel,
      wireframe: false,
      //blending: THREE.AdditiveBlending,
      //depthTest: true,
      //depthWrite: true,
      transparent: true,
      vertexColors: true,
      side: THREE.DoubleSide,
    });
   //console.log(this.uniformsT)
    const cylinder = new THREE.Mesh(geoCyl, matshader)
    cylinder.rotation.set(Math.PI/2, 0, 0)
    cylinder.position.z = -2
    
    return cylinder
  }
  
}
