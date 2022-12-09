import { globalAudioContext } from './constants.js'

export class Sound {
  constructor() {
   // this.kick = kick.bind(kick)

  }
  
  kick=()=> {
    const volume = 0.1
    const oscillator = globalAudioContext.createOscillator()
    const gain = globalAudioContext.createGain();
    oscillator.connect(gain);
    gain.gain.value = volume;
    oscillator.type = "sine";
    oscillator.frequency.value = 900
    oscillator.frequency.linearRampToValueAtTime(1500, globalAudioContext.currentTime + .1);
    oscillator.frequency.exponentialRampToValueAtTime(500, globalAudioContext.currentTime + 1);
    gain.connect(globalAudioContext.destination);
    oscillator.start(globalAudioContext.currentTime)
    oscillator.stop(globalAudioContext.currentTime + 1)
  }
  
  bass=()=> {
    const volume = 0.1
    const oscillator = globalAudioContext.createOscillator()
    const gain = globalAudioContext.createGain();
    oscillator.connect(gain);
    gain.gain.value = volume;
    oscillator.type = "square";
    oscillator.frequency.value = 200
    oscillator.frequency.linearRampToValueAtTime(500, globalAudioContext.currentTime + .1);
    oscillator.frequency.exponentialRampToValueAtTime(10, globalAudioContext.currentTime + 1);
    gain.connect(globalAudioContext.destination);
    oscillator.start(globalAudioContext.currentTime)
    oscillator.stop(globalAudioContext.currentTime + .06)
  }
  
  reverb() {
    const oscillator = globalAudioContext.createOscillator()
    var gain = globalAudioContext.createGain();
    oscillator.connect(gain)
    const volume = 0.1
    gain.gain.value = volume
    oscillator.type = "wave";
    oscillator.frequency.value = 100
    //const freq = Math.floor(data.velocity.z * 1000 + 100)
    oscillator.frequency.linearRampToValueAtTime(500, globalAudioContext.currentTime + 1);
    const gainNode = globalAudioContext.createGain()
    oscillator.connect(gainNode);
    gainNode.connect(globalAudioContext.destination);
    oscillator.frequency.exponentialRampToValueAtTime(150, globalAudioContext.currentTime + 1.5)
    let synthSource = globalAudioContext.createBufferSource();
    const synthDelay = globalAudioContext.createDelay(50)
    oscillator.connect(synthDelay)
    synthDelay.connect(globalAudioContext.destination)
    synthDelay.delayTime.setValueAtTime(globalAudioContext.currentTime, globalAudioContext.currentTime + 5.5)
    synthSource.loop = true;
    synthSource.start()
    synthDelay.delayTime.value = 1*volReverb
    synthSource.connect(synthDelay)
    synthDelay.connect(globalAudioContext.destination)
    //oscillator.delayTime.setValueAtTime(2, globalAudioContext.currentTime);
    oscillator.start(globalAudioContext.currentTime)
    oscillator.stop(globalAudioContext.currentTime + 1*volReverb)
  }  
  
  bonus(data) {
    const freq = data.freq
    const ramp = data.ramp
    const oscillator = globalAudioContext.createOscillator()
    oscillator.frequency.value = freq
    oscillator.type = "sine";
    oscillator.frequency.linearRampToValueAtTime(ramp, globalAudioContext.currentTime + 1);
    const gainNode = globalAudioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(globalAudioContext.destination);
    oscillator.start(globalAudioContext.currentTime)
    oscillator.stop(globalAudioContext.currentTime + data.velocity.z * 5)
  }
  
  go() {
    let lengthTackt = 20;
    var arrKick = []
    var arrBass = []
    for(let i = 0; i<lengthTackt; i++){
      arrKick.push(1)
    }
    
    for(let i = 0; i<lengthTackt; i++){
      if(i % 2 === 0){
        arrBass.push(1)
      } else {
        arrBass.push(0)
      }
    }
   //console.log(arrBass)
    let ret = false
    let dispKick = this.kick.bind(this)
    let dispBass = this.bass.bind(this)
    let dispStart = this.start.bind(this);
    
    var i = 0
    var timer = setInterval(function() {
      if (i >= arrKick.length) {
        clearInterval(timer)
        console.log("The end.")
        ret = true
        //dispKick(1,1)
        //dispStart()
      } else {
        dispBass(arrBass[i++],1.5)
        dispKick(arrKick[i++],1)
       // this.kick(arr[i++], 1)
        //console.log(i + ": " + arrKick[i++])
      }
    }, 100)
    
  }
  
  start(){
    this.go()
  }
}
