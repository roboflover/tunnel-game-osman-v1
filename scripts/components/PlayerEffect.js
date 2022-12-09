import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsPlayerEffect, vsPlayerEffect } from '.././shaders/playerEffect.js'

export class PlayerEffect {
    constructor() {
    this.uniforms = {
        iTime: { value: 1.0 },
        iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
        iOpacity: { value: 0.0 },
        iMixcolA: { value: cnfgColor.pEffectA },
        iMixcolB: { value: cnfgColor.pEffectB },
        toggle: { value: configL01.toggle },
        }
    }

    createPlayerEffect() {
         
        const geo = new THREE.PlaneGeometry(20, 20);
        const mat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: vsPlayerEffect,
          fragmentShader: fsPlayerEffect,
          depthTest: false,
          transparent: true,
          vertexColors: true,
          side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.z -= 0
        
        
        return mesh
    }
}
