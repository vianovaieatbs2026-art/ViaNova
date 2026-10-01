import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type OwlAnimationState = 
  | 'idle' 
  | 'wave' 
  | 'think' 
  | 'talk' 
  | 'celebrate' 
  | 'concern' 
  | 'entrance';

interface OwlAvatar3DProps {
  animationState?: OwlAnimationState;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  className?: string;
  onAvatarClick?: () => void;
  showPedestal?: boolean;
}

export const OwlAvatar3D: React.FC<OwlAvatar3DProps> = ({
  animationState = 'idle',
  size = 'md',
  interactive = true,
  className = '',
  onAvatarClick,
  showPedestal = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const stateRef = useRef({
    animationState,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    isHovered: false
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current.animationState = animationState;
  }, [animationState]);

  useEffect(() => {
    stateRef.current.isHovered = isHovered;
  }, [isHovered]);

  // Dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'xs': return { width: 56, height: 56 };
      case 'sm': return { width: 80, height: 80 };
      case 'md': return { width: 140, height: 140 };
      case 'lg': return { width: 220, height: 220 };
      case 'xl': return { width: 300, height: 300 };
      default: return { width: 140, height: 140 };
    }
  };

  const { width, height } = getDimensions();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting System for stylized 3D character
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cyan/Blue fill light from left (ViaNova brand tint)
    const fillLight = new THREE.DirectionalLight(0x00aaff, 1.4);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Warm rim light from behind (gives character depth and separation)
    const rimLight = new THREE.DirectionalLight(0xfacc15, 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 3. Materials Definition (ViaNova brand palette)
    // Dark Navy Blue for outer feathers and cap
    const navyFeatherMat = new THREE.MeshStandardMaterial({
      color: 0x0f223d,
      roughness: 0.55,
      metalness: 0.1,
    });

    // Bright Royal Blue for wings and accents
    const royalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0052cc,
      roughness: 0.45,
      metalness: 0.15,
    });

    // Pure White for belly and facial disc
    const whitePlumageMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
      metalness: 0.05,
    });

    // Fluorescent High-Visibility Yellow for Safety Vest
    const reflectiveVestMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Traffic warning safety yellow
      emissive: 0x714b00,
      emissiveIntensity: 0.15,
      roughness: 0.35,
      metalness: 0.2,
    });

    // Silver Reflective Stripes on Vest
    const silverReflectiveMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0xffffff,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.7,
    });

    // Golden Amber for Beak and Talons
    const amberBeakMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.2,
    });

    // Shiny Black for Cap Visor and Pupils
    const shinyBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.2,
      metalness: 0.3,
    });

    // Vibrant Luminous Cyan/Amber for Iris
    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant electric cyan-blue iris
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.4,
    });

    // Cornea Sparkle
    const cornealSparkleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // 4. Constructing 3D Owl Model Hierarchy
    const owlRoot = new THREE.Group();
    scene.add(owlRoot);

    // Optional Pedestal / Platform
    if (showPedestal) {
      const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.2, 32);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.3
      });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = -1.2;
      scene.add(pedestal);

      // Cyan neon ring on pedestal
      const ringGeo = new THREE.TorusGeometry(1.22, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.1;
      scene.add(ring);
    }

    // --- TORSO / BODY ---
    const bodyGroup = new THREE.Group();
    owlRoot.add(bodyGroup);

    // Plump cute pear-shaped body
    const bodyGeo = new THREE.SphereGeometry(0.85, 32, 28);
    bodyGeo.scale(1, 1.25, 0.95);
    const bodyMesh = new THREE.Mesh(bodyGeo, navyFeatherMat);
    bodyMesh.castShadow = true;
    bodyGroup.add(bodyMesh);

    // White belly plumage (soft contrast)
    const bellyGeo = new THREE.SphereGeometry(0.65, 24, 24);
    bellyGeo.scale(0.9, 1.15, 0.4);
    const bellyMesh = new THREE.Mesh(bellyGeo, whitePlumageMat);
    bellyMesh.position.set(0, -0.05, 0.65);
    bodyGroup.add(bellyMesh);

    // --- REFLECTIVE SAFETY VEST (Chaleco Reflectivo Amarillo) ---
    const vestGroup = new THREE.Group();
    bodyGroup.add(vestGroup);

    // Main yellow vest wrap
    const vestGeo = new THREE.CylinderGeometry(0.88, 0.92, 0.72, 32, 1, true, -Math.PI * 0.4, Math.PI * 1.8);
    const vestMesh = new THREE.Mesh(vestGeo, reflectiveVestMat);
    vestMesh.position.set(0, -0.05, 0.05);
    vestGroup.add(vestMesh);

    // Silver reflective horizontal safety stripes
    const stripeTopGeo = new THREE.CylinderGeometry(0.89, 0.91, 0.09, 32, 1, true, -Math.PI * 0.4, Math.PI * 1.8);
    const stripeTop = new THREE.Mesh(stripeTopGeo, silverReflectiveMat);
    stripeTop.position.set(0, 0.12, 0.05);
    vestGroup.add(stripeTop);

    const stripeBottomGeo = new THREE.CylinderGeometry(0.91, 0.93, 0.09, 32, 1, true, -Math.PI * 0.4, Math.PI * 1.8);
    const stripeBottom = new THREE.Mesh(stripeBottomGeo, silverReflectiveMat);
    stripeBottom.position.set(0, -0.22, 0.05);
    vestGroup.add(stripeBottom);

    // Small Traffic Safety Badge on vest chest
    const vestBadgeGeo = new THREE.CircleGeometry(0.08, 16);
    const vestBadgeMat = new THREE.MeshStandardMaterial({ color: 0x0052cc, roughness: 0.3 });
    const vestBadge = new THREE.Mesh(vestBadgeGeo, vestBadgeMat);
    vestBadge.position.set(0.28, 0.12, 0.85);
    vestBadge.rotation.y = 0.3;
    vestGroup.add(vestBadge);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0.05);
    owlRoot.add(headGroup);

    // Head base sphere
    const headGeo = new THREE.SphereGeometry(0.82, 32, 30);
    headGeo.scale(1.1, 0.98, 1.02);
    const headMesh = new THREE.Mesh(headGeo, navyFeatherMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Facial disc (White facial feathers around eyes)
    const facialDiscLGeo = new THREE.CircleGeometry(0.38, 24);
    const facialDiscL = new THREE.Mesh(facialDiscLGeo, whitePlumageMat);
    facialDiscL.position.set(-0.35, 0.02, 0.78);
    facialDiscL.rotation.y = -0.15;
    headGroup.add(facialDiscL);

    const facialDiscRGeo = new THREE.CircleGeometry(0.38, 24);
    const facialDiscR = new THREE.Mesh(facialDiscRGeo, whitePlumageMat);
    facialDiscR.position.set(0.35, 0.02, 0.78);
    facialDiscR.rotation.y = 0.15;
    headGroup.add(facialDiscR);

    // --- BIG EXPRESSIVE EYES ---
    const eyeLGroup = new THREE.Group();
    eyeLGroup.position.set(-0.35, 0.04, 0.8);
    headGroup.add(eyeLGroup);

    const eyeRGroup = new THREE.Group();
    eyeRGroup.position.set(0.35, 0.04, 0.8);
    headGroup.add(eyeRGroup);

    // Eye Sclera (White eye background)
    const eyeScleraGeo = new THREE.SphereGeometry(0.26, 20, 20);
    eyeScleraGeo.scale(1, 1, 0.5);

    const eyeScleraL = new THREE.Mesh(eyeScleraGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    eyeLGroup.add(eyeScleraL);

    const eyeScleraR = new THREE.Mesh(eyeScleraGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    eyeRGroup.add(eyeScleraR);

    // Eye Iris (Luminous cyan-blue)
    const irisGeo = new THREE.CircleGeometry(0.18, 24);
    const irisL = new THREE.Mesh(irisGeo, eyeIrisMat);
    irisL.position.set(0, 0, 0.14);
    eyeLGroup.add(irisL);

    const irisR = new THREE.Mesh(irisGeo, eyeIrisMat);
    irisR.position.set(0, 0, 0.14);
    eyeRGroup.add(irisR);

    // Pupils (Deep black)
    const pupilGeo = new THREE.CircleGeometry(0.11, 24);
    const pupilL = new THREE.Mesh(pupilGeo, shinyBlackMat);
    pupilL.position.set(0, 0, 0.15);
    eyeLGroup.add(pupilL);

    const pupilR = new THREE.Mesh(pupilGeo, shinyBlackMat);
    pupilR.position.set(0, 0, 0.15);
    eyeRGroup.add(pupilR);

    // Corneal reflections (Cute bright glints giving life to the owl)
    const glintMainGeo = new THREE.CircleGeometry(0.045, 12);
    const glintL1 = new THREE.Mesh(glintMainGeo, cornealSparkleMat);
    glintL1.position.set(0.05, 0.05, 0.16);
    eyeLGroup.add(glintL1);

    const glintR1 = new THREE.Mesh(glintMainGeo, cornealSparkleMat);
    glintR1.position.set(0.05, 0.05, 0.16);
    eyeRGroup.add(glintR1);

    const glintSubGeo = new THREE.CircleGeometry(0.022, 10);
    const glintL2 = new THREE.Mesh(glintSubGeo, cornealSparkleMat);
    glintL2.position.set(-0.04, -0.04, 0.16);
    eyeLGroup.add(glintL2);

    const glintR2 = new THREE.Mesh(glintSubGeo, cornealSparkleMat);
    glintR2.position.set(-0.04, -0.04, 0.16);
    eyeRGroup.add(glintR2);

    // Eyelids for natural smooth blinking
    const eyelidGeo = new THREE.SphereGeometry(0.28, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    eyelidGeo.scale(1, 1, 0.6);
    
    const eyelidL = new THREE.Mesh(eyelidGeo, navyFeatherMat);
    eyelidL.rotation.x = Math.PI; // starts open
    eyelidL.position.set(0, 0, 0.12);
    eyeLGroup.add(eyelidL);

    const eyelidR = new THREE.Mesh(eyelidGeo, navyFeatherMat);
    eyelidR.rotation.x = Math.PI;
    eyelidR.position.set(0, 0, 0.12);
    eyeRGroup.add(eyelidR);

    // --- BEAK (Pico con movimiento al hablar) ---
    const beakGroup = new THREE.Group();
    beakGroup.position.set(0, -0.12, 0.88);
    headGroup.add(beakGroup);

    // Upper beak
    const upperBeakGeo = new THREE.ConeGeometry(0.12, 0.28, 16);
    upperBeakGeo.rotateX(Math.PI * 0.45);
    const upperBeakMesh = new THREE.Mesh(upperBeakGeo, amberBeakMat);
    beakGroup.add(upperBeakMesh);

    // Lower beak (moves when talking)
    const lowerBeakGeo = new THREE.ConeGeometry(0.09, 0.16, 16);
    lowerBeakGeo.rotateX(Math.PI * 0.4);
    const lowerBeakMesh = new THREE.Mesh(lowerBeakGeo, amberBeakMat);
    lowerBeakMesh.position.set(0, -0.06, -0.03);
    beakGroup.add(lowerBeakMesh);

    // --- EAR TUFTS (Penachos de plumas inteligentes) ---
    const earTuftL = new THREE.Group();
    earTuftL.position.set(-0.55, 0.72, 0.1);
    earTuftL.rotation.z = -0.35;
    headGroup.add(earTuftL);

    const earTuftGeo = new THREE.ConeGeometry(0.14, 0.45, 12);
    const earTuftMeshL = new THREE.Mesh(earTuftGeo, royalBlueMat);
    earTuftL.add(earTuftMeshL);

    const earTuftR = new THREE.Group();
    earTuftR.position.set(0.55, 0.72, 0.1);
    earTuftR.rotation.z = 0.35;
    headGroup.add(earTuftR);

    const earTuftMeshR = new THREE.Mesh(earTuftGeo, royalBlueMat);
    earTuftR.add(earTuftMeshR);

    // --- GORRA VIANOVA (Dark Blue Cap with Visor & Logo) ---
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 0.65, 0.08);
    headGroup.add(capGroup);

    // Cap Crown (Hemisphere fitted snugly on head)
    const capCrownGeo = new THREE.SphereGeometry(0.85, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const capCrownMesh = new THREE.Mesh(capCrownGeo, navyFeatherMat);
    capGroup.add(capCrownMesh);

    // Cap Visor / Brim (curved baseball cap brim)
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.45, 0);
    visorShape.quadraticCurveTo(0, 0.5, 0.45, 0);
    visorShape.quadraticCurveTo(0, -0.1, -0.45, 0);

    const visorExtrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };
    const visorGeo = new THREE.ExtrudeGeometry(visorShape, visorExtrudeSettings);
    const visorMesh = new THREE.Mesh(visorGeo, shinyBlackMat);
    visorMesh.position.set(0, 0.05, 0.72);
    visorMesh.rotation.x = -Math.PI * 0.48;
    capGroup.add(visorMesh);

    // ViaNova Embroidered Badge on front of cap with high-contrast 'ViaNova' text
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 256;
    badgeCanvas.height = 96;
    const badgeCtx = badgeCanvas.getContext('2d');
    if (badgeCtx) {
      badgeCtx.fillStyle = '#0a2540';
      badgeCtx.fillRect(0, 0, 256, 96);
      badgeCtx.strokeStyle = '#facc15';
      badgeCtx.lineWidth = 6;
      badgeCtx.strokeRect(4, 4, 248, 88);
      badgeCtx.fillStyle = '#ffffff';
      badgeCtx.font = 'bold 44px sans-serif';
      badgeCtx.textAlign = 'center';
      badgeCtx.textBaseline = 'middle';
      badgeCtx.fillText('ViaNova', 128, 48);
    }
    const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
    const capBadgeGeo = new THREE.BoxGeometry(0.38, 0.14, 0.03);
    const capBadgeMat = new THREE.MeshStandardMaterial({ 
      map: badgeTexture,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0x002060,
      emissiveIntensity: 0.2
    });
    const capBadgeMesh = new THREE.Mesh(capBadgeGeo, capBadgeMat);
    capBadgeMesh.position.set(0, 0.22, 0.82);
    capBadgeMesh.rotation.x = -0.15;
    capGroup.add(capBadgeMesh);

    // Small cap button on top
    const capButtonGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const capButtonMesh = new THREE.Mesh(capButtonGeo, amberBeakMat);
    capButtonMesh.position.set(0, 0.82, 0);
    capGroup.add(capButtonMesh);

    // --- WINGS (Alas con articulación) ---
    // Left Wing
    const wingLGroup = new THREE.Group();
    wingLGroup.position.set(-0.85, 0.2, 0);
    owlRoot.add(wingLGroup);

    const wingGeo = new THREE.ConeGeometry(0.35, 1.1, 16);
    wingGeo.scale(0.5, 1, 1.4);
    wingGeo.rotateZ(0.2);

    const wingLMesh = new THREE.Mesh(wingGeo, royalBlueMat);
    wingLMesh.position.set(-0.1, -0.45, 0);
    wingLGroup.add(wingLMesh);

    // Right Wing (Greeting / Waving Wing)
    const wingRGroup = new THREE.Group();
    wingRGroup.position.set(0.85, 0.2, 0);
    owlRoot.add(wingRGroup);

    const wingRMesh = new THREE.Mesh(wingGeo, royalBlueMat);
    wingRMesh.position.set(0.1, -0.45, 0);
    wingRMesh.rotation.y = Math.PI;
    wingRGroup.add(wingRMesh);

    // --- ACCESORIO: MINI SEÑAL DE TRÁNSITO (Mini Stop / Road Safety Sign) ---
    const signGroup = new THREE.Group();
    signGroup.position.set(0.9, -0.1, 0.4);
    signGroup.rotation.z = -0.15;
    signGroup.rotation.y = -0.3;
    owlRoot.add(signGroup);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.95, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    signGroup.add(poleMesh);

    // Octagonal STOP / PARE sign plate with high-contrast text
    const pareCanvas = document.createElement('canvas');
    pareCanvas.width = 256;
    pareCanvas.height = 256;
    const pareCtx = pareCanvas.getContext('2d');
    if (pareCtx) {
      pareCtx.fillStyle = '#dc2626';
      pareCtx.fillRect(0, 0, 256, 256);
      pareCtx.strokeStyle = '#ffffff';
      pareCtx.lineWidth = 14;
      pareCtx.strokeRect(16, 16, 224, 224);
      pareCtx.fillStyle = '#ffffff';
      pareCtx.font = '900 58px sans-serif';
      pareCtx.textAlign = 'center';
      pareCtx.textBaseline = 'middle';
      pareCtx.fillText('PARE', 128, 128);
    }
    const pareTexture = new THREE.CanvasTexture(pareCanvas);
    const signOctagonGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 8);
    signOctagonGeo.rotateX(Math.PI / 2);
    const signMat = new THREE.MeshStandardMaterial({ 
      map: pareTexture,
      roughness: 0.35 
    });
    const signMesh = new THREE.Mesh(signOctagonGeo, signMat);
    signMesh.position.set(0, 0.42, 0);
    signGroup.add(signMesh);

    // --- TALONS / FEET ---
    const feetGroup = new THREE.Group();
    feetGroup.position.set(0, -1.05, 0.15);
    owlRoot.add(feetGroup);

    const footGeo = new THREE.BoxGeometry(0.16, 0.08, 0.32);
    const footL = new THREE.Mesh(footGeo, amberBeakMat);
    footL.position.set(-0.35, 0, 0);
    feetGroup.add(footL);

    const footR = new THREE.Mesh(footGeo, amberBeakMat);
    footR.position.set(0.35, 0, 0);
    feetGroup.add(footR);

    // 5. Interactive Mouse Tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;
      
      // Normalized between -1 and 1
      stateRef.current.targetMouse.x = (clientX / rect.width) * 2 - 1;
      stateRef.current.targetMouse.y = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop (60 FPS Procedural Smooth Animations)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkTime = 2.5 + Math.random() * 2;
    let isBlinking = false;
    let blinkProgress = 0;

    // Entrance animation progress
    let entranceProgress = 0;
    owlRoot.scale.set(0.01, 0.01, 0.01);
    owlRoot.position.y = -0.5;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const anim = stateRef.current.animationState;

      // Smooth mouse interpolation
      stateRef.current.mouse.x += (stateRef.current.targetMouse.x - stateRef.current.mouse.x) * 0.08;
      stateRef.current.mouse.y += (stateRef.current.targetMouse.y - stateRef.current.mouse.y) * 0.08;

      // --- ENTRANCE ANIMATION ---
      if (entranceProgress < 1) {
        entranceProgress = Math.min(1, entranceProgress + delta * 2.2);
        // Elastic overshoot pop-up
        const t = entranceProgress;
        const scaleVal = THREE.MathUtils.lerp(0.1, 1, 1 - Math.pow(1 - t, 3));
        owlRoot.scale.set(scaleVal, scaleVal, scaleVal);
        owlRoot.position.y = THREE.MathUtils.lerp(-0.5, 0, t);
      }

      // --- NATURAL EYE BLINKING ---
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > nextBlinkTime) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
        nextBlinkTime = 2.0 + Math.random() * 3.5;
      }

      if (isBlinking) {
        blinkProgress += delta * 12; // Fast blink
        if (blinkProgress <= Math.PI) {
          // Eyelid closes then opens using sine curve
          const closeAmount = Math.sin(blinkProgress);
          eyelidL.rotation.x = Math.PI - closeAmount * 1.6;
          eyelidR.rotation.x = Math.PI - closeAmount * 1.6;
        } else {
          isBlinking = false;
          eyelidL.rotation.x = Math.PI;
          eyelidR.rotation.x = Math.PI;
        }
      }

      // --- PROCEDURAL ANIMATIONS BASED ON STATE ---
      // Base Floating Hover (Sinusoidal subtle floating)
      const hoverY = Math.sin(elapsedTime * 2.2) * 0.06;
      owlRoot.position.y = (entranceProgress >= 1 ? 0 : owlRoot.position.y) + hoverY;

      // Subtle breathing scale
      const breathScale = 1 + Math.sin(elapsedTime * 2.8) * 0.015;
      bodyMesh.scale.set(1 * breathScale, 1.25 * breathScale, 0.95);

      // Target rotations
      let targetHeadRotY = stateRef.current.mouse.x * 0.35;
      let targetHeadRotX = -stateRef.current.mouse.y * 0.25;
      let targetHeadRotZ = 0;

      let targetWingRRotZ = 0;
      let targetWingRRotX = 0;
      let targetWingLRotZ = 0;

      let targetLowerBeakY = -0.06;

      if (anim === 'idle') {
        // Natural curious posture
        targetHeadRotZ = Math.sin(elapsedTime * 0.8) * 0.04;
        targetWingRRotZ = Math.sin(elapsedTime * 1.5) * 0.05;
        targetWingLRotZ = -Math.sin(elapsedTime * 1.5) * 0.05;
      } 
      else if (anim === 'wave') {
        // Friendly waving greeting with right wing
        const waveSpeed = 9.0;
        const waveAngle = Math.sin(elapsedTime * waveSpeed);
        targetWingRRotZ = 1.35 + waveAngle * 0.35;
        targetWingRRotX = -0.2;
        targetHeadRotZ = -0.15;
        targetHeadRotY = 0.1;
      } 
      else if (anim === 'think') {
        // Head tilted curiously in deep thought, looking slightly up
        targetHeadRotZ = 0.32; // Incline head to the side
        targetHeadRotX = -0.18; // Look upwards slightly
        targetHeadRotY = -0.15;
        targetWingLRotZ = 0.45; // Touch chest thoughtfully
      } 
      else if (anim === 'talk') {
        // Expressive talking head movement and articulated beak
        const talkSpeed = 12.0;
        const talkCycle = Math.abs(Math.sin(elapsedTime * talkSpeed));
        targetLowerBeakY = -0.06 - talkCycle * 0.08;
        
        targetHeadRotX = Math.sin(elapsedTime * 6.0) * 0.08;
        targetHeadRotY = stateRef.current.mouse.x * 0.2 + Math.cos(elapsedTime * 4.0) * 0.06;
        
        targetWingRRotZ = 0.3 + Math.sin(elapsedTime * 5.0) * 0.15;
        targetWingLRotZ = -0.3 - Math.cos(elapsedTime * 5.0) * 0.15;
      } 
      else if (anim === 'celebrate') {
        // Joyful energetic celebration (hop & spread wings!)
        const hopY = Math.abs(Math.sin(elapsedTime * 7.0)) * 0.22;
        owlRoot.position.y += hopY;
        
        targetWingRRotZ = 1.2 + Math.sin(elapsedTime * 8.0) * 0.3;
        targetWingLRotZ = -(1.2 + Math.sin(elapsedTime * 8.0) * 0.3);
        
        targetHeadRotX = -0.15;
        targetHeadRotZ = Math.sin(elapsedTime * 6.0) * 0.15;

        // Joyful eyes
        eyelidL.rotation.x = Math.PI - 0.35;
        eyelidR.rotation.x = Math.PI - 0.35;
      } 
      else if (anim === 'concern') {
        // Empathetic comforting posture
        targetHeadRotZ = -0.18;
        targetHeadRotX = 0.12;
        targetWingRRotZ = 0.2;
        targetWingLRotZ = -0.2;
      }

      // Smoothly interpolate to targets
      headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.1;
      headGroup.rotation.z += (targetHeadRotZ - headGroup.rotation.z) * 0.1;

      wingRGroup.rotation.z += (targetWingRRotZ - wingRGroup.rotation.z) * 0.15;
      wingRGroup.rotation.x += (targetWingRRotX - wingRGroup.rotation.x) * 0.15;
      wingLGroup.rotation.z += (targetWingLRotZ - wingLGroup.rotation.z) * 0.15;

      lowerBeakMesh.position.y += (targetLowerBeakY - lowerBeakMesh.position.y) * 0.2;

      // Soft bounce on accessory sign
      signGroup.rotation.z = -0.15 + Math.sin(elapsedTime * 3.0) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height, showPedestal]);

  return (
    <div 
      ref={mountRef}
      onClick={onAvatarClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        stateRef.current.targetMouse = { x: 0, y: 0 };
      }}
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${
        interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      title="Búho Asistente ViaNova • Educación y Seguridad Vial"
      aria-label="Búho Asistente ViaNova"
    />
  );
};
