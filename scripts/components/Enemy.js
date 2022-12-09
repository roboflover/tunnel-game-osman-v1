// @ts-check
import * as THREE from '.././lib/three.module.js'
import { mergeBufferGeometries } from '.././lib/BufferGeometryUtils.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls } from '.././components/render.js';
import { cnfgColor, configL01 } from './constants.js'
import { fsEnemy, vsEnemy } from '.././shaders/enemy.js'

export class EnemyCreator {
  constructor(/* enemyMeshes, enemyData */) {
    this.toggleLeftRight = false

    this.uniforms = {
      iTime: { value: 1.0 },
      iResolution: { value: new THREE.Vector3(1.0, 1., 1.) },
      iOpacity: { value: 1.0 },
      iMixcolB: { value: cnfgColor.enemyB },
      iMixcolA: { value: cnfgColor.enemyA },
      toggle: { value: configL01.toggle },
    }
  }

  randTime() { return 2.0 /*Math.random()+1.0*0.01*/ }

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

  createEnemy(width) {
    const pivotPoint = new THREE.Object3D();
    const data = this.setParam()
    const group = new THREE.Group()
    const cospos = Math.random() * 6.28
    const rand = 0 //Math.floor(Math.random() * 1.2)

    let enemy = this.createCircle()
    let newWidth = width / 2

    group.add(enemy)
    if (this.toggleLeftRight) {
      group.position.x = Math.random() * newWidth
      this.toggleLeftRight = false
    } else if (!this.toggleLeftRight) {
      group.position.x = -Math.random() * newWidth
      this.toggleLeftRight = true
    }
    group.position.randY = Math.random() * 2
    group.position.accumulateX = group.position.x
    group.position.y = 0
    group.position.z = 0

    // scene.add(group)
    // this.enemyMeshes.push(group)
    // this.enemyData.push(data)
    data.mesh = group

    return data
  }

  createCircle() {

    const group = new THREE.Group()
    const geoTriangle = new THREE.CircleGeometry(0.2, 32);

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vsEnemy,
      fragmentShader: fsEnemy,
      depthTest: true,
      transparent: false,
      vertexColors: true,

    })
    const triangle = new THREE.Mesh(geoTriangle, mat)
    const geoSphere = new THREE.SphereBufferGeometry(.18, 16, 16);
    const matSphere = new THREE.MeshBasicMaterial({ color: cnfgColor.bonusC })

    const geoBorder = new THREE.CircleGeometry(0.25, 32);
    const matBorder = new THREE.MeshBasicMaterial({ color: cnfgColor.enemyA })
    const border = new THREE.Mesh(geoBorder, matBorder)
    border.position.z -= 0.001
    //group.add(border)
    group.add(triangle)
    return group
  }
}
