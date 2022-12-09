import * as THREE from '.././lib/three.module.js'
// import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsBackground, vsBackground } from '.././shaders/background.js'

export class Background{
  constructor(){
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1000.0, 1000., 1000.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.roadA },
      iMixcolA: { value: cnfgColor.roadB },
      toggle: { value: configL01.toggle },
    }    
  }
  addBackground(){
    const geoCyl = new THREE.PlaneBufferGeometry(1000, 1000 )
    const matCyl = new THREE.MeshBasicMaterial({
      color: "green",
      side: THREE.DoubleSide,
      wireframe: true
    })
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsBackground,
      fragmentShader: fsBackground,
      depthTest: true,
      transparent: false,
      vertexColors: true,
    
    })
    const background = new THREE.Mesh(geoCyl, mat)
    background.renderOrder = 0
    background.position.z = -500
    scene.add(background)
  }  
  
}
