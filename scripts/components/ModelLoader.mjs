import * as THREE from '../lib/three.module.js'

export default class ModelLoader {
  constructor () {
    this.loader = new THREE.ObjectLoader()
  }

  /**
   * @param {string} url
   * @param {THREE.Material} material
   */
  async loadAsync (url, material) {
    const group = new THREE.Group()
    const geometry = await this.loader.loadAsync(url)
    geometry.material = material

    geometry.castShadow = true;
    geometry.receiveShadow = true;
    group.add(geometry)
    return group
  }
}
