import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsWeaponPlayer, vsWeaponPlayer } from '.././shaders/weaponPlayer.js'

export class WeaponPlayer {
  constructor(weaponPlayerMeshes, weaponPlayerData) {
    this.weaponPlayerData = weaponPlayerData
    this.weaponPlayerMeshes = weaponPlayerMeshes
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
  
addWeaponPlayer(pos, bonusToogle) {
  const data = this.setParam()  
  const bullet = this.createBullet(bonusToogle)
  bullet.position.x = pos.x
  bullet.position.y = pos.y
  scene.add(bullet)
  this.weaponPlayerMeshes.push(bullet)
  this.weaponPlayerData.push(data)
  return data
}  

createBullet(bonusToogle) { 
  /*
будет у тебя объект позиции

object.position.userData = {
  init: 5,
  accumulated: 0
}

в цикле анимации

var ud = object.position.userData;
ud.accumulated += velocity.y;
object.position.y = ud.init + id.accumulated;

тогда можешь менять init - оно будет прыгать по Y, с учетом пройденного расстояния
как-то так
*/
  const mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vsWeaponPlayer,
    fragmentShader: fsWeaponPlayer,
    depthTest: true,
    transparent: false,
    vertexColors: true,
  
  })
  
  const geoSphere = new THREE.SphereBufferGeometry(.08, 16, 16);

let colorMat
if(bonusToogle){
  colorMat = cnfgColor.bulletA
} else {
  colorMat = cnfgColor.bulletB
}
const matSphere = new THREE.MeshBasicMaterial({ color: colorMat })
const weaponPlayer = new THREE.Mesh(geoSphere, matSphere)

  
return weaponPlayer
  }
}
