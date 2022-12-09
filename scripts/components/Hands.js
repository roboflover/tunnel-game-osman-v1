import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsHands, vsHands } from '.././shaders/hands.js'

export class Hands {
  constructor(){
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolA: { value: cnfgColor.handsA },
      iMixcolB: { value: cnfgColor.handsB },
      toggle: { value: configL01.toggle },
    }
  }
  
  addHands(){
    //console.log(mergeBufferGeometries)
    const geoCyl = new THREE.CylinderBufferGeometry(.25, .08, 3, 3, 10, true, )
    //console.log(geoCyl) 
    const geoMushrm = new THREE.CylinderBufferGeometry(.7, .1, 0.5, 6, 10, true, )
    let geoArr = []
    geoArr.push(geoCyl, geoMushrm)
    geoCyl.translate(-0., -1.5, 0.)
    geoMushrm.translate(-0., -3.0, 0.)
    const merged = mergeBufferGeometries(geoArr);
    const matCyl = new THREE.MeshBasicMaterial({
      color: "green",
      side: THREE.DoubleSide,
      wireframe: true
    })
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsHands,
      fragmentShader: fsHands,
      depthTest: false,
      //depthMode: THREE.AlwaysDepth,
      transparent: true,
      vertexColors: true,
    
    })
    const gribRA = new THREE.Mesh(merged, mat)
    //console.log(gribRA.geometry.attributes)
    const scale = 0.5
    const group = new THREE.Group()
    const groupR = new THREE.Group()
    gribRA.scale.set(scale, scale, scale)
    gribRA.rotation.z = Math.PI/2*1.2
    gribRA.position.y = -1.9
    gribRA.position.x = .2
    gribRA.position.z = -3
    
    const gribRB = gribRA.clone()
    gribRB.rotation.z = Math.PI / 2 * 1.5
    gribRB.scale.set(0.4, 0.4, 0.4)
    
    const gribRC = gribRA.clone()
    gribRC.rotation.z = Math.PI / 2 * 1.7
    //gribRC.scale.set(0.4, 0.4, 0.4)
    groupR.add(gribRC)
    groupR.add(gribRA)
    groupR.add(gribRB)
    
    const groupL = groupR.clone()
    groupL.scale.x = -1
    group.add(groupL)
    group.add(groupR)
    
    return group
  }
  
  addHandsHorror() {
const geoCyl = new THREE.CylinderBufferGeometry(.25, .08, 3, 3, 10, true, )
//console.log(geoCyl) 
const geoMushrm = new THREE.CylinderBufferGeometry(.7, .1, 0.5, 6, 10, true, )
let geoArr = []
geoArr.push(geoCyl, geoMushrm)
geoCyl.translate(-0., -1.5, 0.)
geoMushrm.translate(-0., -3.0, 0.)
const merged = mergeBufferGeometries(geoArr);
const matCyl = new THREE.MeshBasicMaterial({
  color: "green",
  side: THREE.DoubleSide,
  wireframe: true
})
const mat = new THREE.ShaderMaterial({
  uniforms: this.uniforms,
  vertexShader: vsHands,
  fragmentShader: fsHands,
  depthTest: false,
  //depthMode: THREE.AlwaysDepth,
  transparent: true,
  vertexColors: true,

})
const gribRA = new THREE.Mesh(merged, mat)
//console.log(gribRA.geometry.attributes)
const scale = 0.5
const group = new THREE.Group()
const groupR = new THREE.Group()
gribRA.scale.set(scale, scale, scale)
gribRA.rotation.z = Math.PI / 2 * .7
gribRA.position.y = -.9
gribRA.position.x = .2
gribRA.position.z = -3

const gribRB = gribRA.clone()
gribRB.rotation.z = Math.PI / 2 * 1.3
gribRB.scale.set(0.4, 0.4, 0.4)

const gribRC = gribRA.clone()
gribRC.rotation.z = Math.PI / 2 * 1.7
//gribRC.scale.set(0.4, 0.4, 0.4)
groupR.add(gribRC)
groupR.add(gribRA)
groupR.add(gribRB)

const groupL = groupR.clone()
groupL.scale.x = -1
group.add(groupL)
group.add(groupR)

return group    
  }
}
