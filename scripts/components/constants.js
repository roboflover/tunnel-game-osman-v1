import * as THREE from '.././lib/three.module.js'

export const BPM = 0.45;
export const globalAudioContext = new AudioContext()

const saturation = 100
const colorRand = Math.floor(1)
const colRatio = 40
export const cnfgColor = {
  bodyHorrorA: new THREE.Color("hsl(130, 100%, 50%)"),
  bodyHorrorB: new THREE.Color("hsl(300, 100%, 50%)"),
  bodySmileA: new THREE.Color("hsl(70, 100%, 50%)"),
  bodySmileB: new THREE.Color("hsl(270, 100%, 50%)"),
  tunnSSmile: new THREE.Color("hsl(280, 100%, 50%)"),
  tunnSHorror: new THREE.Color("hsl(0, 100%, 100%)"),
  tunnelA: new THREE.Color("hsl(200, 100%, 50%)"),
  tunnelB: new THREE.Color("hsl(50, 100%, 50%)"),
  bulletA: new THREE.Color("hsl(300, 100%, 50%)"),
  bulletB: new THREE.Color("hsl(50, 100%, 50%)"),
  handsA: new THREE.Color("hsl(90, 100%, 50%)"),
  handsB: new THREE.Color("hsl(220, 0%, 50%)"),
  mandalaA: new THREE.Color("hsl(220, 100%, 50%)"),
  mandalaB: new THREE.Color("hsl(150, 100%, 50%)"),
  batA: new THREE.Color("hsl(80, 100%, 50%)"),
  batB: new THREE.Color("hsl(150, 100%, 50%)"),
  circlesA: new THREE.Color("hsl(80, 100%, 50%)"),
  circlesB: new THREE.Color("hsl(150, 100%, 50%)"),
  backgroundA: new THREE.Color("hsl(80, 100%, 50%)"),
  backgroundB: new THREE.Color("hsl(150, 100%, 50%)"),
  lightningA: new THREE.Color("hsl(80, 100%, 50%)"),
  lightningB: new THREE.Color("hsl(80, 100%, 50%)"),
  enemyA: new THREE.Color("hsl(20, 100%, 50%)"),
  enemyB: new THREE.Color("hsl(350, 100%, 50%)"),
  bonusA: new THREE.Color("hsl(300, 100%, 50%)"),
  bonusB: new THREE.Color("hsl(150, 100%, 50%)"),
  bonusC: new THREE.Color("hsl(200, 100%, 50%)"),
  pEffectB: new THREE.Color("hsl(120, 100%, 50%)"),
  pEffectA: new THREE.Color("hsl(200, 100%, 50%)"),
  
}

const sprndm = Math.floor(1)
//const sprndm = Math.floor(7)


const arrNum = Math.floor(1)
const min = 24
const max = 172
const num = 12
export const configL01 = {
  toggle: 0.,
  camX: 0,
  camY: 0,
  camZ: 10,
  linewidth: 1/*window.innerHeight / 160*/,
  brainHealthWidth: window.innerHeight / 220,
  tubePoint: window.innerHeight / 40,
  maxPointsCount: 1,
  masonSize: window.innerHeight / 170,
  masonModuleSize: window.innerHeight / 11.1,
}
