import * as THREE from '.././lib/three.module.js'
// import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsStars, vsStars } from '.././shaders/stars.js'

export class Stars{
  constructor(){
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.starsA },
      iMixcolA: { value: cnfgColor.starsB },
      toggle: { value: configL01.toggle },
    }        
  }

  addStars(){
    const geoCyl = new THREE.PlaneBufferGeometry(10, 10 )
    const matCyl = new THREE.MeshBasicMaterial({
      color: "green",
      side: THREE.DoubleSide,
      wireframe: true
    })
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsStars,
      fragmentShader: fsStars,
      depthTest: false,
      //depthMode: THREE.AlwaysDepth,
      transparent: true,
      vertexColors: true,
    
    })
    const background = new THREE.Mesh(merged, mat)
    scene.add(background)
  }  
  
}
