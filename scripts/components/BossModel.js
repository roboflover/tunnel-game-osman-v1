// @ts-check
import * as THREE from '../lib/three.module.js'
import ModelLoader from './ModelLoader.mjs'

import { fsSmile, vsSmile } from '../shaders/smile.js'
import { fsHorror, vsHorror } from '../shaders/horror.js'
import { fsBody, vsBody } from '../shaders/body.js'
import { configL01, cnfgColor, BPM, globalAudioContext } from '../components/constants.js'

export default class BossModel {
  constructor() {
    /** @type {THREE.Group | null} */
    this.legatoNoise = null
    /** @type {THREE.Group | null} */
    this.agressive = null
    /** @type {THREE.Group | null} */
    this.spikes = null
    /** @type {THREE.Group | null} */
    this.screen = null
    this.group = new THREE.Group()
    this.loaderTexture = new THREE.TextureLoader();
    this.modelLoader = new ModelLoader()
    this.uniformsBoss = {
        iTime: { value: 1.0 },
        iResolution: { value: new THREE.Vector3(1., 1., 1.) },
        iMixcolA: { value: cnfgColor.bodySmileA },
        iMixcolB: { value: cnfgColor.bodySmileB },
        iOpacity: { value: 1.0 },
      }
    this.shaderSmile = new THREE.ShaderMaterial({
    uniforms: this.uniformsBoss,
    vertexShader: vsSmile,
    fragmentShader: fsSmile,
    //blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
    })
  }

  async initialize(scene) {
    [this.legatoNoise, this.screen] = await Promise.all([
      this.createLegatoNoise(),
      this.createModule()
    ])
    scene.add(this.legatoNoise)
    scene.add(this.screen)
  }

  async createLegatoNoise() {
    


    const astraModuleMat = new THREE.MeshPhongMaterial({
      color: 0xecebec,
      specular: 0x000000,
      shininess: 0
    });

    const legatoNoisePromise = this.modelLoader.loadAsync(
      'models/json/boss-head.json',
      this.shaderSmile
    )

    //this.promiseAll(this.legatoNoisePromise)
    return legatoNoisePromise
  }

  async createModule() {
    const screenTexture = await this.loaderTexture.loadAsync(
      'textures/mandala.jpg'
    );

    const screenPromise = this.modelLoader.loadAsync(
      'models/json/boss-lepestok.json',
      this.shaderSmile
    )

    return screenPromise

  }
}