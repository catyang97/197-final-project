const THREE = require('three');
import Noise from './Noise';
var OrbitControls = require('./OrbitControls.js');
var Stats = require('./stats.min.js');
var dat = require('./dat.gui.min.js');
// if ( WEBGL.isWebGLAvailable() === false ) {
//   document.body.appendChild( WEBGL.getWebGLErrorMessage() );
//   document.getElementById( 'container' ).innerHTML = "";
// }
var container, stats;
var camera, controls, scene, renderer, raycaster;
var worldWidth = 128, worldDepth = 128;
var data = heightField(worldWidth, worldDepth);
var mouse = new THREE.Vector2(),INTERSECTED;
var deleteKey = false;
var createKey = false;
var currBlock = 'water';
var gui;
var params = {
  grass: true,
  water: false,
  dirt: false
}

var texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/atlas.png' );
texture.magFilter = THREE.NearestFilter;
var material = new THREE.MeshBasicMaterial({map: texture});

var grassTopTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/grass.png');
grassTopTexture.magFilter = THREE.NearestFilter;
var grassTopMaterial = new THREE.MeshBasicMaterial({map: grassTopTexture});

var waterTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/grass.png');
waterTexture.magFilter = THREE.NearestFilter;
var waterMaterial = new THREE.MeshBasicMaterial({map: waterTexture});

var dirtTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/dirt.png');
dirtTexture.magFilter = THREE.NearestFilter;
var dirtMaterial = new THREE.MeshBasicMaterial({map: dirtTexture});

var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
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

  gui = new dat.GUI();
  gui.add(params, 'grass').onChange(changeToGrass);
  gui.add(params, 'water').onChange(changeToWater);
  gui.add(params, 'dirt').onChange(changeToDirt);

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
  for (let z = -worldDepth/2; z < worldDepth/2; z++) {
    for (let x = -worldWidth/2; x < worldWidth/2; x++) {
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(x,0,z);
      scene.add(cube);
    }
  }

  // Lights!
  var ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add(ambientLight);

  // For mouse movement tracking
  raycaster = new THREE.Raycaster();
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('resize', onWindowResize, false);
}

// Procedurally generate height of blocks at each point
function heightField(height, width) {

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // controls.handleResize();
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}
function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(scene.children);
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      INTERSECTED = intersects[ 0 ].object;
      if (deleteKey) {
        console.log(INTERSECTED.position);
        scene.remove(INTERSECTED);
      }
      if (createKey) {
        // click mouse and add block on top
        var intPos = INTERSECTED.position;
        var cube;
        if (params.grass === true) {
          cube = new THREE.Mesh(geometry, material);
        } else if (params.water === true) {
          cube = new THREE.Mesh(geometry, waterMaterial);
        } else if (params.dirt === true) {
          cube = new THREE.Mesh(geometry, dirtMaterial);
        }

        cube.position.set(intPos.x, intPos.y + 1, intPos.z);
        scene.add(cube);
      }
    }
  }
}

function handleKeyDown(event) {
  switch (event.keyCode) {
    case 68:
      deleteKey = true;
      break;
    case 67:
      createKey = true;
      break;
  }
}

function onKeyDown(event) {
  handleKeyDown(event);
}

function onKeyUp(event) {
  deleteKey = false;
  createKey = false;
}

function changeToGrass(type) {
  if (type === true) {
    currBlock = 'grass';
    params.dirt = false;
    params.water = false;
  }
}

function changeToWater(type) {
  if (type === true) {
    currBlock = 'water';
    params.grass = false;
    params.dirt = false;
  }
}

function changeToDirt(type) {
  if (type === true) {
    currBlock = 'dirt'; 
    params.grass = false;
    params.water = false;
  }
}