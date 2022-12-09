// @ts-check
import * as THREE from './lib/three.module.js'
import { THREEx } from './lib/threex.domevents.js'
import { OrbitControls } from './lib/OrbitControls.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls, container, onWindowResize } from './components/render.js'
import { Sound } from './components/Sound.js'
import { Animated } from './components/Animated.js'
import { Tunnel } from './components/Tunnel.js'
import { Mandala } from './components/Mandala.js'
import { Znak } from './components/Znak.js'
import { PlayerEffect } from './components/PlayerEffect.js'
import { Bullet } from './components/Bullet.js'
import { WeaponPlayer } from './components/WeaponPlayer.js'
import { Bonus } from './components/Bonus.js'
import { EnemyCreator } from './components/Enemy.js'
import { Stopwatch } from './components/Stopwatch.js'
import { configL01, cnfgColor, BPM, globalAudioContext } from './components/constants.js'
import { fsSmile, vsSmile } from './shaders/smile.js'
import { fsHorror, vsHorror } from './shaders/horror.js'
import { fsBody, vsBody } from './shaders/body.js'
import EnemySystem from './components/EnemySystem.js'
import Boss, { BossBulletSystem } from './components/Boss.js'
import BossModel from './components/BossModel.js'
import ModelLoader from './components/ModelLoader.mjs';

import { PlayerBulletSystem } from './components/Player.js'

const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
let sound
let animated
let globalClock, bonusClock, enemyClock, gameClock, tunnelClock, bulletClock, weaponPlayerClock
let bonusTime, enemyTime, gameTime, tunnelTime, bulletTime, weaponPlayerTime, lepestokTime
let globalTime = 0
let bullet
let weaponPlayer
let pause = 0
let bonus
let weaponCount
let mandala, mandalaMesh
let znak, znakPoint
//let enemy
/** @type {EnemySystem} */
let enemySystem
let tunnel, tunnelMesh
let rabbitFace
let rabbitBody
let floverModule
let floverLepestokA
let floverLepestokB
let lepestokABGroup
let lepestokCDGroup
let lepestokEFGroup
let playerEffect, playerEffectMesh
let rabbitTest
let speedPlayer = 0
let bonusMeshes = []
let bonusData = []
let tunnelMeshes = []
let tunnelData = []
let bulletMeshes = []
let bulletData = []
//let playerBulletMeshes = []
//let weaponPlayerData = []
let bulletToogle = true
let bonusToogle = false
// let weaponToogle = true
let gameOverToggle = false
let bonusAttack = false
let enemyAttack = false
let mouseUpDown = false
let distEnemyToBulletToogle = true
let batFlag = false
let uniformsGuys = {}
let promiseAll = 0
let widthSize = 5

const playerObj = {
  lepestok: null,
  module: null,
  head: null
}

const bossObj = {
  head: null,
  lepestok: null,
  module: null,
  turbo: null,
}

const gameConfig = {
  speed: 1.0,
  spawn: 2.0,
  player: 0.01,
  timeout: 500,
  score: 0, // boss health
  health: 10, // player health
  stop: 1,
}
const mouse = new THREE.Vector2( 1, 1 );
const rabbytYHh = -2.8
const player = new THREE.Group()
const loaderClass = document.querySelector('.loading')
const scoreQuanity = /** @type {Node} */ (document.querySelector('.score__quanity'))
const healthQuanity = /** @type {Node} */ (document.querySelector('.health__quanity'))
const gameOver = document.querySelector('.game-over')
const gameOverResume = document.querySelector('.game-over__resume')
const gameOverTotalScore = document.querySelector('.game-over__total-score')
const gamePause = document.querySelector('.pause')
const globalWatch = new Stopwatch(0)
const lepestokWatch = new Stopwatch(0)

globalWatch.start()
lepestokWatch.start()

const bossModel = new BossModel();

await Promise.all([
  bossModel.initialize(scene),
])

// @ts-ignore
gameOverResume.addEventListener("mousedown", evt => {
  evt.preventDefault()
  console.log('press')
  globalClock.start()
  bonusClock.start()
  enemyClock.start()
  gameClock.start()
  tunnelClock.start()
  gameConfig.speed = 1.0
  gameConfig.spawn = 2.0
  gameConfig.player = 0.01
  gameConfig.timeout = 500
  gameConfig.health = 10
  gameConfig.score = 0
  gameConfig.stop = 1
  gameOver.classList.remove('game-over_opened')
  // player.position.x = 0
  // player.position.y = 0
  player.scale.set(0.3, 0.3, 0.3)
  player.rotation.set(Math.PI / 2, 0, 0)
  gameOverToggle = false
  //player.rotation.set(0, Math.PI, 0)
  //player.scale.set(1,1,1)
  healthQuanity.textContent = String(gameConfig.health)
  scoreQuanity.textContent = String(0)
});

healthQuanity.textContent = String(gameConfig.health)
scoreQuanity.textContent = String(gameConfig.score)


window.addEventListener('resize', () => {
  onWindowResize();
  });

function init() {
  setupScene()
}

function loaderrr(event){
  loaderClass.classList.remove('loading_opened');
}

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

//console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {
  promiseAll++
  if(promiseAll == 3){
    loaderrr()
  }
	//console.log( 'Loading complete!', promiseAll);
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
	//console.log( 'There was an error loading ' + url );
};

async function add3dObjects(){

uniformsGuys = {
  iTime: { value: 1.0 },
  iResolution: { value: new THREE.Vector3(1., 1., 1.) },
  iMixcolA: { value: cnfgColor.bodySmileA },
  iMixcolB: { value: cnfgColor.bodySmileB },
  iOpacity: { value: 1.0 },
}
const shaderSmile = new THREE.ShaderMaterial({
  uniforms: uniformsGuys,
  vertexShader: vsSmile,
  fragmentShader: fsSmile,
  //blending: THREE.AdditiveBlending,
  depthTest: true,
  transparent: true,
})

const shaderHorror = new THREE.ShaderMaterial({
  uniforms: uniformsGuys,
  vertexShader: vsSmile,
  fragmentShader: fsHorror,
  //blending: THREE.AdditiveBlending,
  depthTest: true,
  transparent: true,
})

const shaderBody = new THREE.ShaderMaterial({
  uniforms: uniformsGuys,
  vertexShader: vsBody,
  fragmentShader: fsBody,
  //blending: THREE.NoBlending,
  //blending: THREE.AdditiveBlending,
  depthTest: true,
  transparent: true,
 // vertexColors: false,
  opacity: 0.5,
})

const loaderRabbitTEST = new THREE.ObjectLoader(manager);

playerObj.head = await loaderRabbitTEST.loadAsync('models/json/player-head.json')
playerObj.head.material = shaderSmile;
scene.add(playerObj.head)

rabbitTest = await loaderRabbitTEST.loadAsync('models/test01.json')
rabbitTest.material = shaderSmile;
const scaleTest = .5
rabbitTest.scale.set(scaleTest, scaleTest, scaleTest)
rabbitTest.position.y = 2

rabbitFace = await loaderRabbitTEST.loadAsync('models/head1.json')
rabbitFace.material = shaderSmile
rabbitFace.renderOrder = 2
rabbitFace.position.z = 0.9

rabbitBody = await loaderRabbitTEST.loadAsync('models/body1.json')
rabbitBody.material = shaderBody
rabbitBody.renderOrder = 2
rabbitBody.position.z = 0.9

floverModule = await loaderRabbitTEST.loadAsync('models/module1.json')
floverModule.material = shaderSmile
floverModule.renderOrder = 2

floverLepestokA = await loaderRabbitTEST.loadAsync('models/lepestok1.json')
floverLepestokA.material = shaderSmile
floverLepestokA.renderOrder = 2
floverLepestokB = floverLepestokA.clone()


const lepRatio = 2.0
lepestokABGroup = new THREE.Group()

floverLepestokA.position.set(0, lepRatio, 0)
floverLepestokB.position.set(0, -lepRatio, 0)
floverLepestokB.rotation.z = Math.PI
lepestokABGroup.add(floverLepestokA)
lepestokABGroup.add(floverLepestokB)
lepestokABGroup.rotation.set(0,0,Math.PI/3)
lepestokCDGroup = lepestokABGroup.clone()
lepestokCDGroup.rotation.set(0,0,-Math.PI/3)
lepestokEFGroup = lepestokABGroup.clone()
lepestokEFGroup.rotation.set(0,0,0)

player.add(lepestokABGroup)
player.add(lepestokCDGroup)
player.add(lepestokEFGroup)

 player.add(floverModule)
 player.add(rabbitBody)
 player.add(rabbitFace)
 player.scale.set(0.3, 0.3, 0.3)
 player.rotation.set(Math.PI / 2, 0, 0)
 //player.rotation.set(0, Math.PI, 0)
 //player.scale.set(1,1,1)
 player.position.y = -0.
 //scene.add(rabbitTest)
 scene.add(player)
}

const addPlayerEffectClass = () => {
  playerEffect = new PlayerEffect()
  playerEffectMesh = playerEffect.createPlayerEffect()
  player.add(playerEffectMesh)
}

const addTunnelClass = () => {
  tunnel = new Tunnel(tunnelMeshes, tunnelData)
  tunnelMesh = tunnel.createTunnel()
  // scene.add(tunnelMesh)
}

// const addWeaponPlayerClass = () => {
//   weaponPlayer = new WeaponPlayer(playerBulletMeshes, weaponPlayerData)
// }

const addBulletClass = () => {
  bullet = new Bullet(bulletMeshes, bulletData)
}

const addBonusClass = () => {
  bonus = new Bonus(bonusMeshes, bonusData)

}

const addZnakClass = () => {
  znak = new Znak()
  znakPoint = znak.addZnak()
  //scene.add(znakPoint)
}

const addMandalaClass = () => {
  mandala = new Mandala()
  mandalaMesh = mandala.addMandala()
  // scene.add(mandalaMesh)
}

const addEnemyClass = () => {
  /**
   * @type {THREE.Group[]}
   * */
  const enemyMeshes = []
  /**
   * @type {object}
   * */
  const enemyData = []

  const enemy = new EnemyCreator(enemyMeshes, enemyData)
  enemySystem = new EnemySystem(enemy, animated, enemyMeshes, pause, gameConfig.spawn)
}

const materialButton = new THREE.SpriteMaterial(
{
  color: 0xffffff,
  alphaTest: 0.3,
  opacity:0.0,
});

function getXFOV() {
  // Convert angle to radiant
  const FOV = camera.fov;
  let yFovRadiant = FOV * Math.PI / 180;
  // Calculate X-FOV Radiant
  let xFovRadiant = 2 * Math.atan(Math.tan(yFovRadiant / 2) * (window.innerWidth / window.innerHeight));
  // Convert back to angle
  let xFovAngle = xFovRadiant * 180 / Math.PI;
  return xFovAngle;
}
const xfov = getXFOV() *0.25
const closeZ = .5 / Math.tan((getXFOV()) * Math.PI / 180.0);

const spriteButtonLeft = new THREE.Sprite(materialButton)
const spriteButtonRight = new THREE.Sprite(materialButton)
spriteButtonRight.scale.set(xfov, renderer.domElement.height, 1)
spriteButtonRight.position.x = xfov / 2
spriteButtonLeft.scale.set(xfov, renderer.domElement.height, 1)
spriteButtonLeft.position.x = -xfov/2
scene.add(spriteButtonLeft)
scene.add(spriteButtonRight)

function setEvent(){

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {
  document.addEventListener( 'touchmove', onTouchMove, true )
  document.addEventListener( 'touchstart', toogleMouseDown )
  document.addEventListener( 'touchend', toogleMouseUp )
   } else {
  document.addEventListener( 'mousemove', onMouseMove )
  document.addEventListener( 'mousedown', toogleMouseDown )
  document.addEventListener( 'mouseup', toogleMouseUp )
  }
}

setEvent()
function toogleMouseDown(){
  if(gameConfig.health >= 0) {
  mouseUpDown = true
  pause = 1
  globalWatch.start()
  gamePause.classList.remove('pause_opened')
  player.rotation.x = Math.PI/2
  player.rotation.z = 0
  }
}

function toogleMouseUp(){
  mouseUpDown = false
  pause = 0
  globalWatch.stop()
  //if(gameConfig.health > 0)
  gamePause.classList.add('pause_opened')
  player.rotation.x = Math.PI
  player.rotation.z = Math.PI
}
// mouseUpDown
function onTouchMove( event ) {
  mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
}

function onMouseMove( event ) {
  event.preventDefault();
  if(mouseUpDown){
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
}

function deleteAllObjects(array){
  for (let i = 0; i < array.length; i++) {
    scene.remove(array[i])
  }
  array.splice(0, array.length)
}

function setBulletInterval(){
  bulletToogle = true
}

function setBonusInterval() {
  bonusToogle = false
}

function setDistEnemyToBulletInterval(){
  distEnemyToBulletToogle = true
}

function setBonusAttack(){
  bonusAttack = false
  playerEffect.uniforms.iOpacity.value = 0
}

function setEnemyAttack() {
  uniformsGuys.iOpacity.value = 1.0
  playerEffect.uniforms.iOpacity.value = 0
  enemyAttack = false
}

const addSoundClass = () => {
  sound = new Sound()
}

function isColliding(bulletPosition, bulletRadius, enemyPosition) {
	return 	Math.abs(bulletPosition.y - enemyPosition.y) < bulletRadius
	&& Math.abs(bulletPosition.x - enemyPosition.x) < bulletRadius
	&& Math.abs(bulletPosition.z - enemyPosition.z) < bulletRadius
}

const addAnimationClass = () => {
  animated = new Animated()
  globalClock = animated.addClock()
  bonusClock = animated.addClock()
  enemyClock = animated.addClock()
  gameClock = animated.addClock()
  tunnelClock = animated.addClock()
  bulletClock = animated.addClock()
  weaponPlayerClock = animated.addClock()
}


// Making our boss.
const bossGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const bossMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const bossMesh = new THREE.Mesh( bossGeometry, bossMaterial );
scene.add( bossMesh );

const boss = new Boss(bossMesh, 10)
boss.respawn()

const bossBullets = new BossBulletSystem(boss)

// Making our player.
const playerBullets = new PlayerBulletSystem()

let lastGlobalTime = 0
// let howManyTimesBossBulletHitThePlayerSinceLastRespawn = 0
// let howManyTimesBossBulletHitThePlayer = 0
// console.log(window.innerWidth)
function animate() {
  // Getting time data.
  const currentGlobalTime = globalTime
  const dt = currentGlobalTime - lastGlobalTime

  // Updating boss, player, bullets, collisions, etc.
  // console.log(dt, boss.state?.position)
  boss.update(dt)
  bossBullets.update(dt)

  if (bossBullets.updateCollisionWithPlayer(player.position)) {
    // howManyTimesBossBulletHitThePlayerSinceLastRespawn++
    // howManyTimesBossBulletHitThePlayer++
    // console.info('bullet hit player:', howManyTimesBossBulletHitThePlayer, 'bullet hit player since movement change:', howManyTimesBossBulletHitThePlayerSinceLastRespawn)

    gameConfig.health--
    console.info('a bullet hit the player, health now:', gameConfig.health)
  }

  // if (howManyTimesBossBulletHitThePlayerSinceLastRespawn >= 2) {
  //   boss.respawn()
  //   howManyTimesBossBulletHitThePlayerSinceLastRespawn = 0
  //   console.info('boss changed movement type')
  //  }

  playerBullets.update(dt, player.position)
  if (playerBullets.updateCollisionWithBoss(boss.getPosition())) {
    boss.decrementHealth()
    console.log('player bullet hit the boss; boss health:', boss.health)
    if (boss.health % 2 == 0) {
      boss.respawn()
      console.log('boss changed movement type; boss health:', boss.health)
    }
  }

  // Updating GUI.
  gameConfig.score = boss.health
  scoreQuanity.textContent = String(gameConfig.score)
  healthQuanity.textContent = String(gameConfig.health)

  // Setting time.
  lastGlobalTime = currentGlobalTime

  //RUBBER GAME
  if(window.innerWidth < 400){
    widthSize = 3
  } else if(window.innerWidth < 600){
    widthSize = 5
  } else if(window.innerWidth < 800){
    widthSize = 8
  }
  globalTime = globalWatch.update()
  lepestokTime = lepestokWatch.update() * 6
  bonusTime = animated.getElapsedTime(bonusClock)
  enemyTime = animated.getElapsedTime(enemyClock)
  gameTime = animated.getElapsedTime(gameClock)
  tunnelTime = animated.getElapsedTime(tunnelClock)
  bulletTime = animated.getElapsedTime(bulletClock)
  weaponPlayerTime = animated.getElapsedTime(weaponPlayerClock)
  ///// PLAYER
  player.position.x = mouse.x*4
  player.position.y = mouse.y*4
  playerEffectMesh.rotation.x = Math.PI/2


  if (floverLepestokA){
    floverLepestokA.rotation.x = Math.PI/6*Math.sin(lepestokTime) - Math.PI/8
    lepestokCDGroup.children[0].rotation.x = Math.PI/6*Math.sin(lepestokTime) - Math.PI/8
    lepestokEFGroup.children[0].rotation.x = Math.PI/6*Math.sin(lepestokTime) - Math.PI/8
  }
  if (floverLepestokB){
    floverLepestokB.rotation.x = -Math.PI / 6* Math.sin(lepestokTime) + Math.PI/8
    lepestokCDGroup.children[1].rotation.x = -Math.PI / 6* Math.sin(lepestokTime) + Math.PI/8
    lepestokEFGroup.children[1].rotation.x = -Math.PI / 6* Math.sin(lepestokTime) + Math.PI/8
  }
///// WEAPON PLYER
// if(bonusToogle){
//   weaponCount = 0.05
// } else {
//   weaponCount = 0.5
// }
// if (weaponPlayerTime > weaponCount && pause > 0) {
//     weaponPlayerClock = animated.resetClock(weaponPlayerClock)
//     weaponPlayer.addWeaponPlayer(player.position, bonusToogle)
//   //console.log(weaponPlayerTime)
// }

// /** @type {THREE.Group[]} */
// const enemyMeshesToRemove = []
/** @type {number[]} */
// const indicesOfBulletsToRemove = []
enemySystem.widthSize = widthSize

// Collisions, etc.
//  Enemy & Player's bullet.
// for (let i = 0; i < playerBulletMeshes.length; i++) {
//   playerBulletMeshes[i].position.y += 0.1

//   const bulletPosition = playerBulletMeshes[i].position
//   const collisions = enemySystem.boxCast(bulletPosition)
//   for (const enemyCollision of collisions) {
//     if(!gameOverToggle){
//     gameConfig.score += 1
//     scoreQuanity.textContent = String(gameConfig.score)

//     enemySystem.planToRemove(enemyCollision)
//     indicesOfBulletsToRemove.push(i)
//     }
//   }
// }
//  Player & Enemy.
const collisions = enemySystem.circleCast(player.position, .6)
for (const enemyWithCollision of collisions) {
  const alreadyRemoved = !enemySystem.planToRemove(enemyWithCollision)
  if (!alreadyRemoved) {
    //gameConfig.score += 1
    //scoreQuanity.textContent = gameConfig.score
    gameConfig.health -= 1
    if(gameConfig.health > 0 ){
      healthQuanity.textContent = gameConfig.health
    } else {
      healthQuanity.textContent = 0
    }
    sound.kick()
    enemyAttack = true
  } else {
    console.info('alresetEnemyAttackady removed')
  }
}

// for(let i = 0; i < enemySystem.enemies.length; i++){
//   const alreadyRemoved = !enemySystem.planToRemove(enemySystem.enemies.mesh)
//   if (!alreadyRemoved) {
//   const heightEnemy = -1
//   if(enemySystem.enemies[i].mesh.position.y < heightEnemy){
//     enemySystem.destroy(enemySystem.enemies[i].mesh)
//   }
//  }
// }

// Movement, etc.
enemySystem.updateMovement(globalTime, pause, gameConfig.spawn, gameOverToggle)
enemySystem.updateRemoving()
// enemySystem.updateSpawning()
enemySystem.letSpawn = gameConfig.spawn
// console.log(enemySystem.letSpawn)
// Removing bullets.
// for (const indexOfBulletToRemove of indicesOfBulletsToRemove.sort().reverse()) {
//   scene.remove(bulletMeshes[indexOfBulletToRemove])
//   bulletMeshes.splice(indexOfBulletToRemove, 1)
// }

// if (enemyAttack) {
//   const time = globalTime * 19.
//   const sinpos = (Math.sin(time * 0.1))
//   const offsetX = player.position.y
//   player.position.y = (Math.sin(time) * 0.01) + offsetX
//   uniformsGuys.iOpacity.value = Math.sin(globalTime*20)*0.5+0.5
//   playerEffect.uniforms.iOpacity.value = 1
//   playerEffect.uniforms.toggle.value = 0
//   setTimeout(setEnemyAttack, 1000)
//   enemyAttack = false
// }

///// BONUS
if (bonusTime > 10 && pause > 0) {
   bonusClock = animated.resetClock(bonusClock)
  bonus.addBonus(widthSize)
}

for (let i = 0; i < bonusMeshes.length; i++) {
  bonusMeshes[i].position.y -= bonusData[i].velocity.y*pause //*gameConfig.speed*gameConfig.stop
  if (bonusMeshes[i].position.y > 20) {
    bonusData[i].dead = true
  }
  if (bonusData[i].dead === true) {
    scene.remove(bonusMeshes[i])
    bonusMeshes.splice(i, 1)
    bonusData.splice(i, 1)
  }
  /// chek bonus collision
  if(bonusMeshes[i] != undefined) {
    const distPlayer = player.position
    const distBonus = bonusMeshes[i].position
    const distPlayerToBonus = distPlayer.distanceTo(distBonus)
    if (distPlayerToBonus < 1) {
      bonusToogle = true
      // weaponToogle = true
      setTimeout(setBonusInterval, 3000)
      gameConfig.score +=1
      scoreQuanity.textContent = gameConfig.score
      sound.bass()
      scene.remove(bonusMeshes[i])
      bonusMeshes.splice(i, 1)
      bonusData.splice(i, 1)
      bonusAttack = true
    }
  /// rotation
  if(bonusMeshes[i] != undefined) {
    //bonusMeshes[i].rotation.x += bonusData[i].velocity.x * 0.2*pause
    //bonusMeshes[i].rotation.y += bonusData[i].velocity.y * 0.2*pause
    bonusMeshes[i].rotation.z += bonusData[i].velocity.z * 0.2*pause
    }
  }
}

if (bonusAttack) {
  // const time = globalTime * 19.
  // const sinpos = (Math.sin(time * 0.1))
//   const offsetX = player.position.x
//   player.position.x = (Math.sin(time) * 0.01) + offsetX
  playerEffect.uniforms.iOpacity.value = 1
  playerEffect.uniforms.toggle.value = 1
  setTimeout(setBonusAttack, 1000)

  playerBullets.powerupTimeLeft = 1000
}

///// GAME SPEED
if (gameTime > 20) {
  gameConfig.spawn *= 1.5
  gameConfig.speed = 1.05
  gameConfig.player = 1.05
  gameConfig.timeout = .95

  if(gameConfig.spawn >= 10)
    gameConfig.spawn = 10
  if(gameConfig.speed >= 5)
    gameConfig.speed = 5
  if(gameConfig.player >= 0.025)
    gameConfig.player = 0.025
  if(gameConfig.timeout <= 188)
    gameConfig.timeout = 188

  // console.log(`
  // gameConfig.spawn ${gameConfig.spawn}
  // gameConfig.speed ${gameConfig.speed}
  // gameConfig.player ${gameConfig.player}
  // gameConfig.timeout ${gameConfig.timeout}
  // `)

  gameClock = animated.resetClock(gameClock)
}
///// GAME OVER
if(gameConfig.health <= 0) {
  globalClock.stop()
  bonusClock.stop()
  enemyClock.stop()
  gameClock.stop()
  tunnelClock.stop()
  gameConfig.stop = 0
  gameOver.classList.add('game-over_opened')
  gameOverToggle = true
  //deleteAllObjects(enemyMeshes)
  deleteAllObjects(bonusMeshes)
  deleteAllObjects(bulletMeshes)
  player.position.x = 0
  player.position.y = 0
  player.scale.set(1,1,1)
  playerEffectMesh.rotation.x = 0
  player.rotation.x=Math.PI
  player.rotation.z=Math.PI
  //player.rotation.z=Math.PI/3
  //player.rotation.y = Math.sin(globalTime*0.25) * (Math.PI/2*0.2 )
  gameOverTotalScore.textContent = `Total score: ${gameConfig.score}`
}

///// GAME PAUSE
if(gameConfig.health <= 0){
gamePause.classList.remove('pause_opened')
}



// UNIFORMS
  uniformsGuys.iTime.value = Math.sin(globalTime*0.05)*50+50
  bonus.uniforms.iTime.value = globalTime
  mandala.uniforms.iResolution.value.x = renderer.domElement.width
  mandala.uniforms.iResolution.value.y = renderer.domElement.height
  mandala.uniforms.iTime.value = Math.sin(globalTime * .25) * 4 + 50
  enemySystem.getUniforms().iTime.value = globalTime
  tunnel.uniforms.iResolution.value.x = renderer.domElement.width
  tunnel.uniforms.iResolution.value.y = renderer.domElement.height
  tunnel.uniforms.iTime.value = globalTime*2
  znak.uniforms.iTime.value = globalTime*2
  tunnelMesh.rotation.y = globalTime*0.1
  playerEffect.uniforms.iTime.value = globalTime*2.1

controls.update()

requestAnimationFrame(animate)

render()

}

function render() {

	renderer.render( scene, camera );

}

init()
//onPause()
addZnakClass()
addPlayerEffectClass()
addMandalaClass()
addTunnelClass()
// addWeaponPlayerClass()
addBulletClass()
addBonusClass()
addAnimationClass()
addEnemyClass()
add3dObjects()
addSoundClass()
animate()

/*
// SKETCH
class Collider {
  constructor (center, radius) {
    this.center = center
    this.radius = radius
  }

  // Is point inside collider?
  pointCast (point) {
    return (point.distanceToSquared(this.center) < this.radius * this.radius)
  }
}
class BulletSystem {
  getCollisionsWith (collider) {
    return bullets.filter(b => collider.pointCast(b))
  }
}
const enemyBulletSystem = new BulletSystem()
const playerBulletSystem = new BulletSystem()
// ...
// bullet collisions
//  from enemies with player
const bulletCollisions = enemyBulletSystem.getCollisionsWith(player.getCollider())
//  from player with enemies
//  ???
// bullet move
enemyBulletSystem.update()
playerBulletSystem.update()
// bullet remove
enemyBulletSystem.updateRemoving()
playerBulletSystem.updateRemoving()
// bullet spawn
enemySystem.updateBulletSpawn(enemyBulletSystem)
if (player.shoots) playerBulletSystem.addBullet(player.position)
*/
