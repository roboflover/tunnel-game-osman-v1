import * as THREE from '.././lib/three.module.js';
import { OrbitControls } from '.././lib/OrbitControls.js'

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .1, 1000)
export const renderer = new THREE.WebGLRenderer();
export const light = new THREE.AmbientLight( 0xffffff ); // soft white light
export const directionalLight = new THREE.DirectionalLight( 0xffffff, 10.5 );
export const controls = new OrbitControls(camera, renderer.domElement);
export let container
export function setupScene() {
	//camera
	camera.position.z = 15
	camera.position.x = 0
	camera.position.y = 0

	controls.enabled = false
	
const axesHelper = new THREE.AxesHelper( 5 ); 
  //scene.add( axesHelper );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	//renderer
	renderer.setSize( window.innerWidth, window.innerHeight );
	// scene
	scene.background = new THREE.Color( 0x000 );
	//light
	directionalLight.position.x = 0;
	directionalLight.position.y = 50;
	directionalLight.position.z = 50;
	scene.add( light );
	//scene.add( directionalLight );
	//document.getElementById( 'container' ).appendChild( renderer.domElement );
	container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}


export function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

// export {setupScene}; 
