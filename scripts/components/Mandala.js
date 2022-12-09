import * as THREE from '.././lib/three.module.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsTunnel, vsTunnel } from '.././shaders/tunnel.js'
import { fsMandala, vsMandala } from '.././shaders/mandala.js'


export class Mandala {
  constructor(tunnelMeshes, tunnelData) {
    this.points
    this.tunnelData = tunnelData
    this.tunnelMeshes = tunnelMeshes
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolA: { value: cnfgColor.mandalaA },
      iMixcolB: { value: cnfgColor.mandalaB },
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

  createMandala(){
    //this.setVelocity(this.data)
    const PARTICLE_SIZE = configL01.masonSize * 11.7
    const position = [0, 0, 10]
    const geometry = new THREE.BufferGeometry()
    const sizes = [10]
    const colors = [1., 1., 1.]

    geometry.attributes.color = new THREE.Float32BufferAttribute(colors, 3)
    geometry.attributes.position = new THREE.Float32BufferAttribute(position, 3)
    geometry.attributes.size = new THREE.Float32BufferAttribute(sizes, 1)
    //console.log(geometry.attributes)
    const mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vsMandala,
    fragmentShader: fsMandala,
    //blending: THREE.MaxEquation,
    depthTest: false,
    transparent: true,
    vertexColors: true
  })
    
  const pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: configL01.tubePoint,
      blending: THREE.MaxEquation,
      depthTest: false,
      transparent: true,
      //sizeAttenuation: false,
      //vertexColors: true,
      //alphaMap: ptexture,
    })
    this.points = new THREE.Points(geometry, mat)
    //point.position.z = -1
    //console.log(point)
    return this.points
  }
  
  addMandala(){
    const mandala = this.createMandala()
    return mandala
  }
  
  createTunnel(){
    const geoCyl = new THREE.CylinderBufferGeometry(
       10, 1, 30, 500, 500, true,)
    
    const matCyl = new THREE.MeshBasicMaterial({ 
      color: "green",
      side: THREE.DoubleSide,
      wireframe: true
      })
      
    const matshader = new THREE.ShaderMaterial({
      uniforms: this.uniformsT,
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
    scene.add(cylinder)
    return cylinder
  }
  
}
