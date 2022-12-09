// @ts-check
import * as THREE from '.././lib/three.module.js'
// @ts-ignore
import { Bullet } from './Bullet.js'
// @ts-ignore
import { setupScene, scene, camera, renderer, light, directionalLight, controls, container, onWindowResize } from './render.js'

export default class Boss {
  constructor(mesh, health) {
    /** @private */
    this.mesh = mesh
    this.health = health

    const amplitude = 3
    const speed = 4

    this.movementStrategies = [
      (pos, t) => {
        pos = pos.clone()
        const xy = new THREE.Vector3(Math.cos(t * speed), Math.sin(t * speed))
        xy.multiplyScalar(amplitude)
        return new THREE.Vector3(xy.x, xy.y, pos.z)
      },
      (pos, t) => {
        pos = pos.clone()
        const xy = new THREE.Vector3(0, Math.sin(t * speed))
        xy.multiplyScalar(amplitude)
        return new THREE.Vector3(xy.x, xy.y, pos.z)
      }
    ]

    this.state = null
  }

  getPosition () {
    return this.mesh.position.clone()
  }

  respawn() {
    const position = new THREE.Vector3(0, 0, 0)

    // @ts-ignore: null or undefined is expected, will produce -1
    const currentStratIndex = this.movementStrategies.indexOf(this.state?.movementStrategy)
    const nextStratIndex = (currentStratIndex + 1) % this.movementStrategies.length
    const movementStrat = this.movementStrategies[nextStratIndex]
    this.state = new BossState(position, movementStrat)
  }

  update(dt) {
    if (!this.state) throw 'Boss is not spawned.'

    this.state.update(dt)
    this.mesh.position.x = this.state.position.x
    this.mesh.position.y = this.state.position.y
    this.mesh.position.z = this.state.position.z
  }

  decrementHealth () { this.health-- }
}

class BossState {
  /**
   * @param {(pos: THREE.Vector3, t: number) => THREE.Vector3} movementStrategy
   */
  constructor(position, movementStrategy) {
    position = position.clone()

    this.movementStrategy = movementStrategy
    this.position = position

    this.lifetime = 0
  }

  update(dt) {
    this.lifetime += dt
    this.position = this.movementStrategy(this.position, this.lifetime)
  }
}

export class BossBulletSystem {
  /**
   * @param {Boss} boss
   */
  constructor (boss) {
    this.boss = boss

    this.timeSinceLastSpawn = 0
    /** @type {BossBullet[]} */
    this.bullets = []
    this.period = 1.0/4.0
    this.boundsExtent = 4

    this.spawnStrategies = [
      (pos) => {
        pos = pos.clone()
        const bullet = new BossBullet(this.createBulletModel(), pos, new THREE.Vector3(0, -8))
        return bullet
      },
      (pos) => {
        pos = pos.clone()
        const bullet = new BossBullet(this.createBulletModel(), pos, new THREE.Vector3(-4, -4))
        return bullet
      }
    ]

    this.currentSpawnStrat = this.spawnStrategies[Math.floor(Math.random() * this.spawnStrategies.length)]
  }

  update (dt) {
    this.timeSinceLastSpawn += dt
    if (this.timeSinceLastSpawn > this.period) {
      this.spawn(this.boss.getPosition())
      this.timeSinceLastSpawn = 0
    }

    // Removing bullets that are out of bounds.
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i]
      if (
        Math.abs(bullet.getPosition().x) > this.boundsExtent ||
        Math.abs(bullet.getPosition().y) > this.boundsExtent
      ) {
        this.despawn(i)
        i--
      }
    }

    for (const bullet of this.bullets) {
      bullet.update(dt)
    }
  }

  /**
   * @param {THREE.Vector3} position
   */
  updateCollisionWithPlayer (position) {
    position = position.clone()

    const bulletRadius = 0.1
    const playerRadius = 0.5
    const thresholdSq = (bulletRadius + playerRadius) * (bulletRadius + playerRadius)

    let indexOfCollidingBullet = -1
    for (let index = 0; index < this.bullets.length; index++) {
      const bullet = this.bullets[index];

      const distanceSq = position
        .clone()
        .sub(bullet.getPosition())
        .lengthSq()

      if (distanceSq < thresholdSq) {
        indexOfCollidingBullet = index
        break
      }
    }

    if (indexOfCollidingBullet >= 0) { this.despawn(indexOfCollidingBullet) }

    return indexOfCollidingBullet >= 0
  }

  spawn (position) {
    position = position.clone()
    const bullet = this.currentSpawnStrat(position)
    this.bullets.push(bullet)
    scene.add(bullet.getMesh())
  }

  despawn (index) {
    scene.remove(this.bullets[index].getMesh())
    this.bullets.splice(index, 1)
  }

  createBulletModel () {
    const geoSphere = new THREE.SphereBufferGeometry(.08, 16, 16);
    const matSphere = new THREE.MeshBasicMaterial({ color: "red" })
    const bullet = new THREE.Mesh(geoSphere, matSphere)
    return bullet
  }
}

class BossBullet {
  /**
   * @param {THREE.Mesh} mesh
   * @param {THREE.Vector3} position
   * @param {THREE.Vector3} velocity
   */
  constructor (mesh, position, velocity) {
    position = position.clone()

    /** @private */
    this.mesh = mesh
    // @ts-ignore
    this.mesh.position.x = position.x
    // @ts-ignore
    this.mesh.position.y = position.y
    // @ts-ignore
    this.mesh.position.z = position.z
    this.velocity = velocity

    // console.info(this)
  }

  update (dt) {
    /** @type {THREE.Vector3} */
    const deltaPos = this.velocity.clone().multiplyScalar(dt)
    // @ts-ignore
    this.mesh.position.add(deltaPos)
  }

  getPosition () {
    // @ts-ignore
    return this.mesh.position.clone()
  }

  getMesh () { return this.mesh }
}
