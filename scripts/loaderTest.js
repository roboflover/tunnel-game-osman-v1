import * as THREE from './lib/three.module.js'
import { THREEx } from './lib/threex.domevents.js'
import { OrbitControls } from './lib/OrbitControls.js'
import { setupScene, scene, camera, renderer, light, directionalLight, controls, container } from './components/render.js'
import { Tunnel } from './components/Tunnel.js'
import { Sound } from './components/Sound.js'
import { Animated } from './components/Animated.js'
import { configL01, cnfgColor, BPM, globalAudioContext } from './components/constants.js'
import { fsSmile, vsSmile } from './shaders/smile.js'
import { fsHorror, vsHorror } from './shaders/horror.js'

const geo = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial()
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

const loader = new THREE.ObjectLoader();
loader.load("models/body4.json", (obj) => {
    //scene.add(obj);
  },
);

function loadJSON(url) {
  return new Promise(resolve => {
    new THREE.JSONLoader.load(url, resolve);
  });
}
const ooobj = loadJSON("models/body4.json")
scene.add(ooobj)

function init() {
  setupScene()
}

function animate(ddd){
  ddd+=10.1
controls.autoRotate = true;
controls.minAzimuthAngle = -1;
controls.maxAzimuthAngle = 1;
controls.autoRotateSpeed = Math.sin(ddd) * 0.1;
	controls.update()
	requestAnimationFrame(animate)
	renderer.render(scene, camera);

	}

animate()
init()
