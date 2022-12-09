import * as THREE from '.././lib/three.module.js'
import { cnfgColor, configL01 } from './constants.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { fsZnak, vsZnak } from '.././shaders/znak.js'

export class Znak {
  
  constructor(tunnelMeshes, tunnelData) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../textures/mandala.jpg');
    // texture.minFilter = THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    this.points
    
    this.tunnelData = tunnelData
    this.tunnelMeshes = tunnelMeshes
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolA: { value: cnfgColor.bonusA },
      iMixcolB: { value: cnfgColor.bonusB },
      iChannel0: { value: texture },
        }
  }

  addZnak() {
    
const loader = new THREE.TextureLoader();
const texture = loader.load('../textures/mandala.jpg');
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;  

const matCyl = new THREE.MeshBasicMaterial({ 
  color: "green",
  side: THREE.DoubleSide,
  wireframe: false
  })
  
    const geometry = new THREE.CircleGeometry(0.5, 64)

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsZnak,
      fragmentShader: fsZnak,
      depthTest: false,
      transparent: true,
      vertexColors: true
    })

    const mesh = new THREE.Mesh(geometry, mat)
    return mesh
    
  }
  

}
