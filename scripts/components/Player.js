// @ts-check
import * as THREE from '.././lib/three.module.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls, container, onWindowResize } from './render.js'

export class PlayerBulletSystem {
  constructor() {
    this.timeSinceLastSpawn = 0
    /** @type {PlayerBullet[]} */
    this.bullets = []
    this.boundsExtent = 4

    this.periodWithoutPowerup = 0.2
    this.periodWithPowerup = 0.05

    this.powerupTimeLeft = 0
  }

  update(dt, position) {
    position = position.clone()

    // Spawning bullets on period.
    const period = this.powerupTimeLeft > 0 ? this.periodWithPowerup : this.periodWithoutPowerup

    this.timeSinceLastSpawn += dt
    if (this.timeSinceLastSpawn > period) {
      this.spawn(position)
      this.timeSinceLastSpawn = 0
    }

    if (this.powerupTimeLeft > 0) { this.powerupTimeLeft -= dt }

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
  updateCollisionWithBoss(position) {
    position = position.clone()

    const bulletRadius = 0.25
    const bossRadius = 0.5
    const thresholdSq = (bulletRadius + bossRadius) * (bulletRadius + bossRadius)

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

  spawn(position) {
    position = position.clone()

    const velocity = new THREE.Vector3(0, 16)

    const bullet = new PlayerBullet(this.createBulletModel(), position, velocity)
    this.bullets.push(bullet)
    scene.add(bullet.getMesh())
  }

  despawn(index) {
    scene.remove(this.bullets[index].getMesh())
    this.bullets.splice(index, 1)
  }

  createBulletModel() {
    const geoSphere = new THREE.SphereBufferGeometry(.08, 16, 16);
    const matSphere = new THREE.MeshBasicMaterial({ color: "yellow" })
    const bullet = new THREE.Mesh(geoSphere, matSphere)
    return bullet
  }
}

class PlayerBullet {
  /**
   * @param {THREE.Mesh} mesh
   * @param {THREE.Vector3} position
   * @param {THREE.Vector3} velocity
   */
  constructor(mesh, position, velocity) {
    position = position.clone()

    /** @private */
    this.mesh = mesh
    this.mesh.position.x = position.x
    this.mesh.position.y = position.y
    this.mesh.position.z = position.z
    this.velocity = velocity

    // console.info(this)
  }

  update(dt) {
    /** @type {THREE.Vector3} */
    const deltaPos = this.velocity.clone().multiplyScalar(dt)
    this.mesh.position.add(deltaPos)
  }

  getPosition() {
    return this.mesh.position.clone()
  }

  getMesh() { return this.mesh }
}