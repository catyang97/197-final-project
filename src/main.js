const THREE = require('three');
import Noise from './Noise';
var OrbitControls = require('./OrbitControls.js');
var mergeBufferGeometries = require('./BufferGeometryUtils.js');
var Stats = require('./stats.min.js');

// if ( WEBGL.isWebGLAvailable() === false ) {
//   document.body.appendChild( WEBGL.getWebGLErrorMessage() );
//   document.getElementById( 'container' ).innerHTML = "";
// }
var container, stats;
var camera, controls, scene, renderer;
var worldWidth = 128, worldDepth = 128;
var data = heightField(worldWidth, worldDepth);
loadScene();
animate();

function loadScene() {
  // Set up sections of window- renderer and stats
  container = document.getElementById('container');
  container.innerHTML = "";
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  stats = new Stats();
  container.appendChild( stats.dom );
  container.appendChild(renderer.domElement);

  // Set up camera, scene
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(-10, 10, -10);
  controls = new THREE.OrbitControls(camera); // Move through scene with mouse and arrow keys
  controls.update();
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.keyPanSpeed = 15.0;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc5ecf9);

  // Add cube to scene
  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  var texture = new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/atlas.png' );
  texture.magFilter = THREE.NearestFilter;
  var material = new THREE.MeshBasicMaterial({ map: texture});
  // var cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);


  var matrix = new THREE.Matrix4();    
  var geometries = [];

  // for (let z = -worldDepth/2; z < worldDepth/2; z++) {
  //   for (let x = -worldWidth/2; x < worldWidth/2; x++) {
  for (let z = 0; z < 10; z++) {
    for (let x = 0; x < 10; x++) {
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(x,0,z);
      scene.add(cube);
    }
  }

  // Lights!
  var ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add( ambientLight );

}

// Procedurally generate height of blocks at each point
function heightField(height, width) {

}

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   controls.handleResize();
// }

function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}

function render() {
  controls.update();
  renderer.render( scene, camera );
}