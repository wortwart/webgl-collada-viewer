"use strict";

var file = './collada/getriebe.dae'; // Pfad zum Collada-Modell
var tilted = true; // Modell um 90 Grad drehen?
var modelScale = 10; // abhängig von der Größe des Modells
var cameraPositionZ = 1500; // Abstand der Kamera
var cameraInitialVector = 30; // je kleiner der Vektor, desto größer erscheint das Modell
var colorLight = [0xffffaa, 0xffffaa]; // Farben der beiden Lichter
var colorBackground = 0x000000; // Hintergrundfarbe
var dimensions = [window.innerWidth, window.innerHeight]; // Größe der Darstellung
var canvasid = '3dmodell'; // Name des Canvas-Containers
var rotate = [0.0005, 0.01, 0.0005]; // Geschwindigkeit der Animation (X-, Y-, Z-Achse)
var rotateManual = 0.1; // manuelle Drehung per Tastatur
var cameraZoom = 50; // manuelle Änderung der Zoomstufe
var play = true; // nach dem Laden sofort animieren?
// ab hier nichts ändern

var camera, scene, renderer, dae, skin, lastFrame;
window.addEventListener('load', function() {
 if (!Detector.webgl) Detector.addGetWebGLMessage(); // Browser kann kein WebGL

 // Collada-Modell
 var loader = new THREE.ColladaLoader();
 if (tilted) loader.options.upAxis = 'X'; // Drehung um 90 Grad
 loader.options.convertUpAxis = true; // an der Y-Achse ausrichten
 loader.load(file, function (collada) {
  dae = collada.scene;
  dae.scale.x = dae.scale.y = dae.scale.z = modelScale;
  scene = new THREE.Scene(); // initiiert die Szene
  scene.add(dae);

  // Kamera
  camera = new THREE.PerspectiveCamera(cameraInitialVector, dimensions[0]/dimensions[1], 1, 10000);
  camera.position.z = cameraPositionZ;

  // Lichter
  var directionalLight1 = new THREE.DirectionalLight(colorLight[0], 1.0);
  directionalLight1.position.set(1, 0, 0);
  var directionalLight2 = new THREE.DirectionalLight(colorLight[1], 2.0);
  directionalLight2.position.set(-1, 0, 0);
  scene.add(directionalLight1);
  scene.add(directionalLight2);

  // Renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(colorBackground);
  renderer.setSize(dimensions[0], dimensions[1]);
  // verankere Darstellung im HTML
  document.getElementById(canvasid).appendChild(renderer.domElement);
  animate();
 });

 var animate = function() {
  requestAnimationFrame(animate); // Animationsschleife
  if (play) { // Drehen, wenn Play-Status == true
   dae.rotation.x += rotate[0];
   dae.rotation.y += rotate[1];
   dae.rotation.z += rotate[2];
  }
  renderer.render(scene, camera);
 };

 // Tastenkürzel abfragen
 window.addEventListener('keydown', function(e) {
  var key = e.keyCode;
  console.log("Key " + key);
  switch (key) {
   case 37: // left
    dae.rotation.y -= rotateManual;
    e.preventDefault();
    break;
   case 39: // right
    dae.rotation.y += rotateManual;
    e.preventDefault();
    break;
   case 38: // up
    dae.rotation.x -= rotateManual;
    e.preventDefault();
    break;
   case 40: // down
    dae.rotation.x += rotateManual;
    e.preventDefault();
    break;
   case 33: // pageup
    dae.rotation.z += rotateManual;
    e.preventDefault();
    break;
   case 34: // pagedown
    dae.rotation.z -= rotateManual;
    e.preventDefault();
    break;
   case 32: // space
    play = play? false : true;
    e.preventDefault();
    break;
   case 187: // plus
    camera.position.z -= cameraZoom;
    e.preventDefault();
    break;
   case 189: // minus
    camera.position.z += cameraZoom;
    e.preventDefault();
    break;
  }
  renderer.render(scene, camera);
 }, false);
}, false);
