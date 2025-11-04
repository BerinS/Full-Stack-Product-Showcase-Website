import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';


// Get container first
const container = document.querySelector('.cover-image');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance'
});

// Setup renderer
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);

camera.position.setZ(20);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);


let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
            // MOBILE: Use container to avoid snapping
            const container = document.querySelector('.cover-image');
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        } else {
            // DESKTOP: Use window dimensions (original working code)
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }, 200);
});

// Initial setup - detect and set appropriately
if (window.innerWidth <= 768) {
    const container = document.querySelector('.cover-image');
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
} else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
}


// Initial resize after delay
setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
}, 100);

const deviceInfo = detectMobileDevice();

/*
//Animated torus for testing
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6357});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
*/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);


// Rim light
const rimLight = new THREE.DirectionalLight(0xffffff, 2);
rimLight.position.set(-5, 3, 10); 
scene.add(rimLight);

//Directional light - top lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 9, 3 );
scene.add(directionalLight);



//Directional backlight - top lighting
const directionalBackLight = new THREE.DirectionalLight(0xffffff, 5);
directionalBackLight.position.set(-6, 3, -10);
scene.add(directionalBackLight);

//Directional backlight - top lighting
const directionalBackLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalBackLight2.position.set(0, 5, -3);
scene.add(directionalBackLight2);



//Spotlight - front lighting
const spotlight = new THREE.SpotLight(
  0xffffff,  // Color (white)
  20,         // Intensity
  100,       // Distance (how far light travels)
  Math.PI/4, // Angle (45-degree cone)
  0.5,       // Penumbra (soft edge % [0-1])
  1          // Decay (light falloff)
);

spotlight.position.set(2, 5, 12);
spotlight.target.position.set(0, 0, 0); // Point at origin
scene.add(spotlight.target);
scene.add(spotlight);




// Natural outdoor lighting (sky color, ground color, intensity)
const hemisphereLight = new THREE.HemisphereLight(
  0x87CEEB,  // Sky color (light blue)
  0x8B4513,  // Ground color (earth brown)
  4       // Intensity
);

scene.add(hemisphereLight);


// Light helpers
/*
const spotlightHelper = new THREE.SpotLightHelper(spotlight, 0xa8326b);
scene.add(spotlightHelper);

const directionalBackLightHelper = new THREE.DirectionalLightHelper(directionalBackLight);
scene.add(directionalBackLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);
*/

// Add this function near your other utility functions
function isFirefox() {
    const ua = navigator.userAgent.toLowerCase();
    
    // Check all possible Firefox identifiers
    return ua.includes('firefox') || 
           ua.includes('fxios') ||
           ua.includes('mozilla') && !ua.includes('chrome') && !ua.includes('samsung') && !ua.includes('edg') ||
           typeof InstallTrigger !== 'undefined';
}

const controls = new OrbitControls(camera, renderer.domElement);

//  Loading detection

const loadingManager = new THREE.LoadingManager();

// when all models and textures load
loadingManager.onLoad = function () {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }
 
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  //console.log(`Loading: ${url} (${itemsLoaded}/${itemsTotal})`);
};

loadingManager.onError = function (url) {
  console.error(`Error loading ${url}`);
};



// Coffee pouch model with textures
const loader = new GLTFLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

const robustoTextureBase = textureLoader.load('./images/robusto_texture_hd.png', (texture) => {
  texture.flipY = false;  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

const robustoTextureNorm = textureLoader.load('./images/robusto_texture_hd_normal.png', (texture) => {
  texture.flipY = false;  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});

// Store materials for editing
let pouchMaterials = [];
let pouch;


// Packet model
const packetModelTexture = textureLoader.load('./images/packet texture.jpg', (texture) => {
  texture.flipY = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

let packetModel;
const packetModelMaterials = [];


// Load first model
loader.load('./models/Coffee_pouch_saccaria.glb', (gltf) => {
  pouch = gltf.scene;
  
  
  const pouchScale = 2 / new THREE.Box3().setFromObject(pouch).getSize(new THREE.Vector3()).length();
  pouch.scale.setScalar(pouchScale);

  // Process first model materials
  pouch.traverse((child) => {
    if (child.isMesh) {
      pouchMaterials.push(child.material);
      child.material = new THREE.MeshStandardMaterial({
        map: robustoTextureBase,
        normalMap: robustoTextureNorm,
        roughness: 0.55,
        metalness: 0.8,
        transparent: true,   
        opacity: 0   
      });
    }
  });

  
  pouch.position.set(12, -7, -2);
  pouch.rotation.set(0, -11.8, -0.1); 
  pouch.scale.set(3, 3, 3); 

  let startingAngle = pouch.rotation.y;

  

  // Now load second model
  loader.load('./models/Packet.glb', (gltf) => {
    packetModel = gltf.scene;
    
    // Position and scale second model (adjust values as needed)
    packetModel.position.set(4, -7, 0); 
    packetModel.rotateX(-0.1); 
    packetModel.rotateY(0.3);
    
    // Auto-scale second model to match first model's approximate size
    const packetModellSize = new THREE.Box3().setFromObject(packetModel).getSize(new THREE.Vector3()).length();
    const packetModelScale = (9 / packetModellSize) ; 
    packetModel.scale.setScalar(packetModelScale);

    // Process second model materials
    packetModel.traverse((child) => {
      if (child.isMesh) {
        packetModelMaterials.push(child.material);
        child.material = new THREE.MeshStandardMaterial({
          map: packetModelTexture,
          roughness: 0.2,
          metalness: 0.6,
          transparent: true,   
          opacity: 0   
        });
      }
    });


    switch (deviceInfo.deviceType) {
      case 'super-small-mobile':
            scene.remove(pouch);
            scene.remove(packetModel);            
            console.log('Super small mobile layout');
            pouch.position.set(5.2, -13, -20);
            packetModel.position.set(-2, -14, -22);            
        
            scene.add(pouch);
            scene.add(packetModel);
            break;

        case 'small-mobile':
            scene.remove(pouch);
            scene.remove(packetModel);            
            console.log('Small mobile layout');
            pouch.position.set(5.2, -14, -12);
            packetModel.position.set(-2, -15, -14);
            if (isFirefox()) {
                pouch.position.set(5.2, -14, -18);
                packetModel.position.set(-2, -15, -19);
            }
        
            scene.add(pouch);
            scene.add(packetModel);
            break;

        case 'medium-mobile':
            scene.remove(pouch);
            scene.remove(packetModel);            
            console.log('Medium mobile layout');
            pouch.position.set(5.2, -14, -12);
            packetModel.position.set(-2, -15, -14);
            if (isFirefox()) {
                pouch.position.set(5.2, -14, -18);
                packetModel.position.set(-2, -15, -19);
            }
        
            scene.add(pouch);
            scene.add(packetModel);
            break;
            
        case 'large-mobile':
           scene.remove(pouch);
            scene.remove(packetModel);  
            console.log('Tablet layout');
            pouch.position.set(5.2, -14, -12);
            packetModel.position.set(-2, -15, -14);
            if (isFirefox()) {
                pouch.position.set(5.2, -14, -18);
                packetModel.position.set(-2, -15, -20);
                console.log('Adjusted for Firefox mobile');
            }
            scene.add(pouch);
            scene.add(packetModel);
            break;
            
        default:
          //Desktop layout
            scene.add(pouch);
            scene.add(packetModel);
            break;
    }

    fadeInModel(pouch, 400);
    fadeInModel(packetModel, 400);    

    //createBoxHelpers();
    
    animate();
  });
});


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

let pouchBoxHelper, packetModelBoxHelper;

function createBoxHelpers() {

  // Create new helpers
  if (pouch) {
    pouchBoxHelper = new THREE.BoxHelper(pouch, 0xffff00); 
    scene.add(pouchBoxHelper);
  }

  if (packetModel) {
    packetModelBoxHelper = new THREE.BoxHelper(packetModel, 0x00ffff); 
    scene.add(packetModelBoxHelper);
  }
}

function detectMobileDevice() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const breakpoints = {
        super_small: 390, 
        small: 480,
        medium: 768,
        large: 1024
    };

    const isSuperSmallMobile = screenWidth <= breakpoints.super_small;
    const isSmallMobile = screenWidth <= breakpoints.small;
    const isMediumMobile = screenWidth <= breakpoints.medium;
    const isLargeMobile = screenWidth <= breakpoints.large;

    let deviceType = 'desktop';
    if (isSuperSmallMobile) deviceType = 'super-small-mobile';
    else if (isSmallMobile) deviceType = 'small-mobile';
    else if (isMediumMobile) deviceType = 'medium-mobile';
    else if (isLargeMobile) deviceType = 'large-mobile';

    return {
        isMobile: isMediumMobile,
        isSuperSmallMobile,
        isSmallMobile,
        isMediumMobile,
        isLargeMobile,
        screenWidth,
        screenHeight,
        deviceType
    };
}




const clock = new THREE.Clock();
let zRotationTime = 0;
const rotationRangeDegrees = 15;
const rotationRange = rotationRangeDegrees * (Math.PI / 180); // Convert to radians
const rotationSpeed = 0.1;
let startingAngle = -5.4;

// Animation loop
function animate() {
  const delta = clock.getDelta();
  
  if (pouch && deviceInfo.deviceType !== 'small-mobile' && deviceInfo.deviceType !== 'medium-mobile') {
    // Smooth oscillating rotation for pouch model
    pouch.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.2 + startingAngle;
  }

  if (pouch && (deviceInfo.deviceType == 'small-mobile' || deviceInfo.deviceType == 'medium-mobile')) {
    // Smooth oscillating rotation for pouch model
    pouch.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.15 + startingAngle;
  }
  
  if (packetModel) {    
    // Smooth oscillating rotation for packet model
    packetModel.rotation.z = Math.sin(clock.elapsedTime * 1.0) * 0.02;
    //packetModel.rotation.y = startingAngle + Math.sin(clock.elapsedTime * rotationSpeed) * rotationRange * (-1);
  }
  
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate()




