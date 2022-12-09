import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsBullet, vsBullet } from '.././shaders/bullet.js'

export class Bullet {
  constructor(bulletMeshes, bulletData) {
    this.bulletData = bulletData
    this.bulletMeshes = bulletMeshes
    this.toogle = false
    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.bulletB },
      iMixcolA: { value: cnfgColor.bulletA },
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
  
addBullet(id, pos) {
  const data = this.setParam()  
  const bullet = this.createBullet()
  bullet.name = id
  bullet.position.x = pos.x
  bullet.position.y = pos.y
  
  if(this.toogle){
  bullet.position.velocity = 0.05
  this.toogle = false
  } else if(!this.toogle) {
  bullet.position.velocity = -0.05  
  this.toogle = true
  }
  scene.add(bullet)
  this.bulletMeshes.push(bullet)
  this.bulletData.push(data)
  return data
}  

  createBullet() { 
  const mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vsBullet,
    fragmentShader: fsBullet,
    depthTest: true,
    transparent: false,
    vertexColors: true,
  
  })
  
  const geoSphere = new THREE.SphereBufferGeometry(.08, 16, 16);
  const matSphere = new THREE.MeshBasicMaterial({ color: cnfgColor.bulletA })
  
  const geoBorder = new THREE.CircleGeometry(1.2, 3);
  const matBorder = new THREE.MeshBasicMaterial({ color: cnfgColor.bulletA })
  const bullet = new THREE.Mesh(geoSphere, matSphere)
  
  
  //return bullet
  }
}
