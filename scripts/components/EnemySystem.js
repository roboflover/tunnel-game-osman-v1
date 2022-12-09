// @ts-check
import * as THREE from '.././lib/three.module.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { EnemyCreator } from './Enemy.js'
import { Animated } from './Animated.js';

class EnemyData {
  /**
   * @param {THREE.Group & {
   *  position: THREE.Vector3,
   *  rotation: THREE.Vector3
   * }} mesh
   */
  constructor (mesh) {
    this.velocity = new THREE.Vector3()
    this.time = 0
    this.dead = false
    this.mesh = mesh
  }
}

export default class EnemySystem {
  /**
   * @param {EnemyCreator} inner
   * @param {Animated} animated
   * */
  constructor (inner, animated, pause, letSpawn) {
    this.inner = inner
    this.animated = animated
    this.pause = pause
    this.letSpawn = letSpawn
    

    this.clock = this.animated.addClock()

    /** @type {EnemyData[]} */
    this.enemies = []

    this.spawnPeriod = 1
    this.enemyRadius = .2

    /** @type {number | null} */
    this.widthSize = null

    /** @type {THREE.Group[]} */
    this.enemiesToRemove = []
  }

  /**
   * @param {number} globalTime
   */
  updateMovement (globalTime, pause, letSpawn, gameOverToggle) {
    this.pause = pause
    for (const enemy of this.enemies) {

      // bullet.position.x += Math.sin(static)
      // bullet.position.y = Math.cos(static)


      enemy.mesh.rotation.z = Math.sin(globalTime)
      enemy.mesh.position.y -= (enemy.velocity.y*(letSpawn*0.05)) * pause


      const heightEnemy = -10 //enemy.mesh.position.randY
      if (enemy.mesh.position.y <= heightEnemy) {
        this.planToRemove(enemy.mesh)
      }

      if(gameOverToggle){
        this.planToRemove(enemy.mesh)
      }


    }
  }

  /**
   * @param {THREE.Group} mesh
   * @returns {boolean} If already planned, returns false.
   * */
  planToRemove (mesh) {
    if (this.enemiesToRemove.includes(mesh)) return false
    this.enemiesToRemove.push(mesh)
    return true
    }

  updateRemoving () {
    for (const enemyToRemove of this.enemiesToRemove) {
      this.destroy(enemyToRemove)
    }
    this.enemiesToRemove.length = 0
  }

  setSpawn(){
    
    //console.log()
    const spawnCount = Math.floor(Math.random()*(this.letSpawn*3))
    for(let i = 0; i<spawnCount; i++){
      this.spawn()
    }
  }

  updateSpawning () {
    if (this.animated.getElapsedTime(this.clock) > this.spawnPeriod
    && this.pause > 0) {

    
    // const spawnCount = Math.floor(Math.random()*(this.letSpawn*3))
    // for(let i = 0; i<spawnCount; i++){
    //   this.spawn()
    // }  
    let dispSetSpawn = this.setSpawn.bind(this)  
    setTimeout(dispSetSpawn, 5000*this.letSpawn)
    
      // const spawnCountB = Math.floor(Math.random()*(letSpawn*3))
      // for(let i = 0; i<spawnCountB; i++){
      // this.spawn()
      // }

      this.clock = this.animated.resetClock(this.clock)
    }
  }

  getUniforms () { return this.inner.uniforms }

  /**
   * @param {THREE.Vector3} center
   * @param {number} radius
   * @returns {THREE.Group[]}
   */
  circleCast (center, radius) {
    const sqrThreshold = (this.enemyRadius + radius) * (this.enemyRadius + radius)

    return this.enemies
      .map(enemy => enemy.mesh)
      .filter(mesh => {

        /** @type {THREE.Vector3} */
        const enemyPosition = mesh.position

        const sqrDistance = enemyPosition.distanceToSquared(center)
        return sqrDistance < sqrThreshold
      })
  }

  /**
   * @param {THREE.Vector3} bulletPosition
   * @returns {THREE.Group[]}
   */
  boxCast (bulletPosition) {
    const bulletRadius = this.enemyRadius

    return this.enemies
      .map(enemy => enemy.mesh)
      .filter(mesh => {
        /** @type {THREE.Vector3} */
        const enemyPosition = mesh.position
        return Math.abs(bulletPosition.y - enemyPosition.y) < bulletRadius
          && Math.abs(bulletPosition.x - enemyPosition.x) < bulletRadius
          && Math.abs(bulletPosition.z - enemyPosition.z) < bulletRadius
      })
  }

  /**
   * @param {THREE.Group} mesh
   * @private
   */
  destroy (mesh) {
    this.remove(mesh)
    scene.remove(mesh)
  }

  /**
   * @param {THREE.Group} mesh
   * @private
   * */
  remove (mesh) {
    const indexOfData = this.enemies.findIndex(
      data => data.mesh === mesh
    )

    if (indexOfData < 0) throw "Already removed."
    this.enemies.splice(indexOfData, 1)
  }

  /** @private */
  spawn () {
    if (!this.widthSize) throw "Must specify widthSize."

    const enemy = this.addEnemy (this.widthSize)
    enemy.mesh.position.x = Math.random() * 8 - 4
    scene.add(enemy.mesh)
  }

  /**
   * @param {number} width
   * @private
  */
  addEnemy (width) {
    const data = this.inner.createEnemy(width)

    const enemy = new EnemyData(data.mesh)
    enemy.velocity = data.velocity
    enemy.time = data.time
    enemy.dead = data.dead

    this.enemies.push(enemy)
    return enemy
  }
}