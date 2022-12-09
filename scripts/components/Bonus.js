import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsBonus, vsBonus } from '.././shaders/bonus.js'
import { Znak } from './Znak.js'

export class Bonus {
  constructor(bonusMeshes, bonusData) {
    this.bonusData = bonusData
    this.bonusMeshes = bonusMeshes
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.bonusA },
      iMixcolA: { value: cnfgColor.bonusB },
      toggle: { value: configL01.toggle },
    }
  }
  
randTime() { return 2.0 /*Math.random()+1.0*0.01*/}

setParam() {
    const data = {
      velocity: new THREE.Vector3(
        0.1,
        0.1,
        0.1
        ),
      time: 1,
      dead: false,
    }
    return data
  }
  
addBonus(radiusSize) {
  const znak = new Znak()
  const data = this.setParam()
  //console.log(radiusSize)
  const group = new THREE.Group()
  const cospos = Math.random() * 6.28
  const rand = 0 //Math.floor(Math.random() * 1.2)
  
  let bonus
  bonus = znak.addZnak()
  bonus.material.uniforms.iTime = this.uniforms.iTime
  group.add(bonus)
  group.position.x = Math.random() * 6 - 3
  group.position.y = 5
  group.position.z = 0
  
  scene.add(group)
  this.bonusMeshes.push(group)
  this.bonusData.push(data)
  return data
}  

  createCube() {
    const group = new THREE.Group()
    const geoCube = new THREE.BoxBufferGeometry(1, 1, 1)
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsBonus,
      fragmentShader: fsBonus,
      depthTest: true,
      transparent: false,
      vertexColors: true,
    
    })
    const matCube = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusA })
    const cube = new THREE.Mesh(geoCube, mat)

    const geoSphere = new THREE.SphereBufferGeometry(.2, 16, 16)
    const matSphere = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusB })
    const sphereA = new THREE.Mesh(geoSphere, matSphere)

    const geoCyl = new THREE.CylinderGeometry(.1, .1, 1, 16)
    const matCyl = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusC })
    const cylinderA = new THREE.Mesh(geoCyl, matCyl)

    const sphereB = sphereA.clone()
    const sphereC = sphereA.clone()
    const sphereD = sphereA.clone()
    const sphereE = sphereA.clone()
    const sphereF = sphereA.clone()
    const sphereG = sphereA.clone()
    const sphereH = sphereA.clone()
    sphereA.position.set(0.5, 0.5, 0.5)
    sphereB.position.set(-0.5, 0.5, 0.5)
    sphereC.position.set(-0.5, -0.5, 0.5)
    sphereD.position.set(-0.5, -0.5, -0.5)
    sphereE.position.set(0.5, -0.5, 0.5)
    sphereF.position.set(-0.5, 0.5, -0.5)
    sphereG.position.set(0.5, 0.5, -0.5)
    sphereH.position.set(0.5, -0.5, -0.5)

    group.add(sphereA)
    group.add(sphereB)
    group.add(sphereC)
    group.add(sphereD)
    group.add(sphereE)
    group.add(sphereF)
    group.add(sphereG)
    group.add(sphereH)

    const cylinderB = cylinderA.clone()
    const cylinderC = cylinderA.clone()
    const cylinderD = cylinderA.clone()
    const cylinderE = cylinderA.clone()
    const cylinderF = cylinderA.clone()
    const cylinderG = cylinderA.clone()
    const cylinderH = cylinderA.clone()
    const cylinderI = cylinderA.clone()
    const cylinderK = cylinderA.clone()
    const cylinderL = cylinderA.clone()
    const cylinderM = cylinderA.clone()

    cylinderA.position.set(0.5, 0.0, 0.5)
    cylinderB.position.set(-0.5, 0.0, 0.5)
    cylinderC.position.set(0.5, 0.0, -0.5)
    cylinderD.position.set(-0.5, 0.0, -0.5)
    cylinderE.position.set(0.0, 0.5, 0.5)
    cylinderF.position.set(0.0, -0.5, 0.5)
    cylinderG.position.set(0.0, 0.5, -0.5)
    cylinderH.position.set(0.0, -0.5, -0.5)
    cylinderI.position.set(0.5, 0.5, 0.0)
    cylinderK.position.set(0.5, -0.5, 0.0)
    cylinderL.position.set(-0.5, 0.5, 0.0)
    cylinderM.position.set(-0.5, -0.5, 0.0)

    cylinderE.rotation.z = Math.PI / 2
    cylinderF.rotation.z = Math.PI / 2
    cylinderG.rotation.z = Math.PI / 2
    cylinderH.rotation.z = Math.PI / 2
    cylinderI.rotation.x = Math.PI / 2
    cylinderK.rotation.x = Math.PI / 2
    cylinderL.rotation.x = Math.PI / 2
    cylinderM.rotation.x = Math.PI / 2

    group.add(cylinderA)
    group.add(cylinderB)
    group.add(cylinderC)
    group.add(cylinderD)
    group.add(cylinderE)
    group.add(cylinderF)
    group.add(cylinderG)
    group.add(cylinderH)
    group.add(cylinderI)
    group.add(cylinderK)
    group.add(cylinderL)
    group.add(cylinderM)

    group.add(cube)  
    group.scale.set(0.5,0.5,0.5)
    return group
  }
  
  createTriangle() {
    
  const group = new THREE.Group()
  
  const geoTriangle = new THREE.TetrahedronBufferGeometry(1, 0);
  const matTriangle = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusB })
  const mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vsBonus,
    fragmentShader: fsBonus,
    depthTest: true,
    transparent: false,
    vertexColors: true,
  
  })
  const triangle = new THREE.Mesh(geoTriangle, mat)
  const geoSphere = new THREE.SphereBufferGeometry(.18, 16, 16);
  const matSphere = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusC })

  const geoCyl = new THREE.CylinderGeometry(.091, .091, 1.4, 16)
  const matCyl = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusA })
  const cylinderA = new THREE.Mesh(geoCyl, matCyl)
  const cylinderB = cylinderA.clone()
  const cylinderC = cylinderA.clone()
  const cylinderD = cylinderA.clone()
  const cylinderE = cylinderA.clone()
  const cylinderF = cylinderA.clone()
  
  const sphereA = new THREE.Mesh(geoSphere, matSphere)
  const sphereB = sphereA.clone()
  const sphereC = sphereA.clone()
  const sphereD = sphereA.clone()
  
  sphereA.position.set(-0.577, -0.577, 0.577)
  sphereB.position.set(0.577, 0.577, 0.577)
  sphereC.position.set(-0.577, 0.577, -0.577)
  sphereD.position.set(0.577, -0.577, -0.577)
  
  cylinderA.rotation.set(0, Math.PI / 4, Math.PI / 2)
  cylinderA.position.set(0, -0.577, 0)
  
  cylinderB.rotation.set(0, Math.PI / 4 + Math.PI / 2, Math.PI / 2)
  cylinderB.position.set(0, 0.577, 0)
  
  cylinderC.rotation.set(-0.75, 0.0, 0.0)
  cylinderC.position.set(-0.55, -0., -0.0)
  
  cylinderD.rotation.set(0.75, 0.0, 0.0)
  cylinderD.position.set(0.55, -0., -0.0)
  
  cylinderE.rotation.set(0, 0.0, 0.75)
  cylinderE.position.set(0., 0, -0.55)
  
  cylinderF.rotation.set(0.0, 0.0, -0.75)
  cylinderF.position.set(0.0, -0., 0.55)
  
  group.add(cylinderA)
  group.add(cylinderB)
  group.add(cylinderC)
  group.add(cylinderD)
  group.add(cylinderE)
  group.add(cylinderF)
  
  group.add(sphereA)
  group.add(sphereB)
  group.add(sphereC)
  group.add(sphereD)
  
  group.add(triangle)
  return group
  }
}
