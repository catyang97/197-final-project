const THREE = require('three');
var OrbitControls = require('./OrbitControls.js');
var Stats = require('./stats.min.js');
var dat = require('./dat.gui.min.js');

var container, stats;
var camera, controls, scene, renderer, raycaster;
var worldWidth = 64, worldDepth = 64;
var mouse = new THREE.Vector2(), INTERSECTED;
var deleteKey = false;
var createKey = false;
var currBlock = 'Grass';
var gui;

var texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/atlas.png' );
texture.magFilter = THREE.NearestFilter;
var material = new THREE.MeshLambertMaterial({map: texture});

var grassTopTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/grass.png');
grassTopTexture.magFilter = THREE.NearestFilter;
var grassTopMaterial = new THREE.MeshLambertMaterial({map: grassTopTexture});

var grasses = [
  material,
  material,
  grassTopMaterial,
  material,
  material,
  material
];
var meshFaceMaterial = new THREE.MeshFaceMaterial(grasses);

var waterTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/catyang97/197-final-project/master/src/textures/water.jpg');
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
  container.appendChild(stats.dom);
  container.appendChild(renderer.domElement);

  // Set up camera, scene
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(10, 10, 10);
  controls = new THREE.OrbitControls(camera, renderer.domElement); // Move through scene with mouse and arrow keys
  controls.update();
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.keyPanSpeed = 15.0;
  scene = new THREE.Scene();
  var background = new THREE.TextureLoader().load('https://raw.githubusercontent.com/catyang97/197-final-project/master/src/cloud.jpg');
  scene.background = background;

  gui = new dat.GUI();

  var params = {
    Brick_Type: 'Grass'
  }

  gui.add(params, 'Brick_Type', ['Grass', 'Water', 'Dirt']).onChange(function(value) {
    if (value === 'Grass') {
      changeToGrass();
    } else if (value === 'Water') {
      changeToWater();
    } else {
      changeToDirt();
    }
  });

  createScene();

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
function createScene(height, width) {
  // Add cubes to scene
  for (let z = -worldDepth/2; z < worldDepth/2; z++) {
    for (let x = -worldWidth/2; x < worldWidth/2; x++) {
      var randHeight = getRandomNumber(0, 2);
      for (var height = 0; height < randHeight; height++) {
        var meshFaceMaterial = new THREE.MeshFaceMaterial(grasses);
        var cube = new THREE.Mesh(geometry, meshFaceMaterial);
        cube.position.set(x,height,z);
        scene.add(cube);
      }
    }
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Clicking on blocks
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      INTERSECTED = intersects[0].object;
      if (deleteKey) {
        scene.remove(INTERSECTED);
      }
      if (createKey) {
        // click mouse and add block on top
        var intPos = INTERSECTED.position;
        var cube;

        if (currBlock === 'Grass') {  
          var material = new THREE.MeshFaceMaterial(grasses);
          cube = new THREE.Mesh(geometry, material);
        } else if (currBlock === 'Water') {
          var material = new THREE.MeshBasicMaterial({map: waterTexture});
          cube = new THREE.Mesh(geometry, material);
        } else if (currBlock === 'Dirt') {
          var material = new THREE.MeshBasicMaterial({map: dirtTexture});
          cube = new THREE.Mesh(geometry, material);
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

function changeToGrass() {
  currBlock = 'Grass';
}

function changeToWater() {
  currBlock = 'Water';
}

function changeToDirt() {
  currBlock = 'Dirt';
}