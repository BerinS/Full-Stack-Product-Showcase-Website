//import '../css/main.css'
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';


// Scene setup
const scene = new THREE.Scene();

// Get canvas and its container
const canvas = document.getElementById('product_canvas');
const container = canvas.parentElement;

// Camera setup
const camera = new THREE.PerspectiveCamera(
  50, 
  container.clientWidth / container.clientHeight, 
  0.1, 
  1000
);
camera.position.setZ(5);
camera.position.setX(1);
camera.position.setY(0);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance'
});

// Renderer configuration
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
renderer.outputEncoding = THREE.sRGBEncoding; // Color accuracy
renderer.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

// Initial setup
updateRendererSize();

// Optimized resize handler with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateRendererSize, 100); // Debounce at 100ms
});

function updateRendererSize() {
  // Get container dimensions (not window)
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Update renderer
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  
  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  // Optional: Trigger a new render if not using animation loop
  renderer.render(scene, camera);
}

/*
//Animated torus for testing
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6357});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
*/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);


// Rim light
const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, -3, 5);
scene.add(rimLight);

const rimLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight2.position.set(-8, 0, 2);
scene.add(rimLight2);

const rimLight3 = new THREE.DirectionalLight(0xffffff, 1);
rimLight3.position.set(2 -3, 5);
scene.add(rimLight3);


//Directional light - top lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 10, -2);
scene.add(directionalLight);



//Directional backlight 
const directionalBackLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalBackLight.position.set(9, -5, -15);
scene.add(directionalBackLight);



//Spotlight - front lighting
const spotlight = new THREE.SpotLight(
  0xffffff,  // Color (white)
  13,         // Intensity
  100,       // Distance (how far light travels)
  Math.PI/4, // Angle (45-degree cone)
  0.5,       // Penumbra (soft edge % [0-1])
  1          // Decay (light falloff)
);

spotlight.position.set(6, 11, 15);
spotlight.target.position.set(0, 0, 0); // Point at origin
scene.add(spotlight.target);
scene.add(spotlight);




// Natural outdoor lighting (sky color, ground color, intensity)
const hemisphereLight = new THREE.HemisphereLight(
  0x87CEEB,  // Sky color (light blue)
  0x8B4513,  // Ground color (earth brown)
  5       // Intensity
);

scene.add(hemisphereLight);


// Light helpers
/*
const spotlightHelper = new THREE.SpotLightHelper(spotlight, 0xa8326b);
scene.add(spotlightHelper);

const directionalBackLightHelper = new THREE.DirectionalLightHelper(directionalBackLight, 0x7469c9);
scene.add(directionalBackLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0x7469c9);
scene.add(directionalLightHelper);
*/

// Add axes helper (X=red, Y=green, Z=blue)
/*
const axesHelper = new THREE.AxesHelper(5); // Size of the helper
scene.add(axesHelper);
*/

// Add grid helper
/*
const gridHelper = new THREE.GridHelper(10, 10); // Size and divisions
scene.add(gridHelper);
*/

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;

// packet package model with textures
const loader = new GLTFLoader();
const packetTextureBase = new THREE.TextureLoader().load('./images/packet texture.png', (texture) => {
  texture.flipY = false;  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

const packetTextureNorm = new THREE.TextureLoader().load('./images/packet texture normal.png', (texture) => {
  texture.flipY = false;  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});

// Store materials for editing
let packetMaterials = [];
let packet;


let packetModel;
const packetModelMaterials = [];

// Show loader before loading starts
document.getElementById("loader").style.display = "flex";

// Load first model
loader.load('./models/Packet.glb', (gltf) => {
  packet = gltf.scene;
  
  
  const packetScale = 2 / new THREE.Box3().setFromObject(packet).getSize(new THREE.Vector3()).length();
  packet.scale.setScalar(packetScale);

  // Process first model materials
  packet.traverse((child) => {
    if (child.isMesh) {
      packetMaterials.push(child.material);
      child.material = new THREE.MeshStandardMaterial({
        map: packetTextureBase,
        normalMap: packetTextureNorm,
        roughness: 0.5,
        metalness: 0.7,
        transparent: true,   
        opacity: 0     
      });
    }
  });

  packet.position.set(0, -2.6, 0);
  packet.scale.set(2.5, 2.5, 2.5); 
  packet.rotation.set(-0.1, 0, 0)

  let startingAngle = packet.rotation.y;

  scene.add(packet);

  // Hide loader once loaded
  document.getElementById("loader").style.display = "none";

  // Fade model in
  fadeInModel(packet, 400); 


  const deviceInfo = detectMobileDevice();

    switch (deviceInfo.deviceType) {
        case 'small-mobile':
            console.log('Small phone layout');
            packet.scale.set(1.8, 1.8, 1.8);
            packet.rotation.set(0, 0, 0);
            packet.position.set(0.2, -1.4, 0);
            break;
            
        case 'medium-mobile':
            console.log('Large phone layout');
           packet.scale.set(1.8, 1.8, 1.8);
            packet.rotation.set(0, 0, 0);
            packet.position.set(0.2, -1.4, 0);
            break;
            
        case 'large-mobile':
            console.log('Tablet layout');
            packet.scale.set(1.9, 1.9, 1.9);
            packet.rotation.set(0, 0, 0);
            packet.position.set(0.2, 0, 0);
            break;
            
        default:
            console.log('Desktop layout');
            scene.add(packet);
            scene.add(packetModel);
            break;
    }
});

let packetBoxHelper, packetModelBoxHelper;

function createBoxHelpers() {

  // Create new helpers
  if (packet) {
    packetBoxHelper = new THREE.BoxHelper(packet, 0xffff00); 
    scene.add(packetBoxHelper);
  }


}


function fadeInModel(object, duration = 1000) {
  const start = performance.now();

  function animate(time) {
    let progress = (time - start) / duration;
    if (progress > 1) progress = 1;

    object.traverse((child) => {
      if (child.isMesh && child.material.transparent) {
        child.material.opacity = progress;
      }
    });

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


function detectMobileDevice() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Common mobile breakpoints
    const isSmallMobile = screenWidth <= 480;    // Small phones
    const isMediumMobile = screenWidth <= 768;   // Tablets and larger phones
    const isLargeMobile = screenWidth <= 1024;   // Small tablets
    
    return {
        isMobile: screenWidth <= 768,
        isSmallMobile,
        isMediumMobile,
        isLargeMobile,
        screenWidth,
        screenHeight,
        deviceType: isSmallMobile ? 'small-mobile' : 
                   isMediumMobile ? 'medium-mobile' : 
                   isLargeMobile ? 'large-mobile' : 'desktop'
    };
}


const clock = new THREE.Clock();
let zRotationTime = 0;
const rotationRangeDegrees = 15;
const rotationRange = rotationRangeDegrees * (Math.PI / 180); // Convert to radians
const rotationSpeed = 0.23;
let startingAngle = 0;

// Animation loop
function animate() {
  const delta = clock.getDelta();
  
  if (packet) {
    //packet.rotation.z = Math.sin(clock.elapsedTime * 1.0) * 0.08;
    //packet.rotation.y += 0.06 * delta;
    packet.rotation.y = startingAngle + Math.sin(clock.elapsedTime * rotationSpeed) * rotationRange;
  }
  
  
  
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate()