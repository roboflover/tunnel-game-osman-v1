import * as THREE from '.././lib/three.module.js'

export class Animated {
  constructor() {
    this.clock = this.addClock()
  }
  
  addClock() {
    const clock = new THREE.Clock()
    return clock
  }
  
  resetClock(clock) {
    return clock = this.addClock()
  }
  
  getElapsedTime(clock){
    return clock.getElapsedTime()
  }
  
  loopItems({arr, count, data, update}){
    for (let i = 0; i < arr.array.length; i += count) {
      update(i)
    }
    arr.needsUpdate = true
  }

}
