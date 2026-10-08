import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AvatarConfig } from '../../types';
import { useApp } from '../../context/AppContext';

interface AvatarViewerProps {
  customConfig?: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
  customConfig,
  size = 'md',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();
  const avatarConfig = customConfig || state.user.avatar;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.35, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(2, 3, 3);
    scene.add(key);

    const rim = new THREE.PointLight(0x00f0ff, 2.5, 8);
    rim.position.set(-2, 2, -1);
    scene.add(rim);

    const fill = new THREE.PointLight(0xa855f7, 1.5, 6);
    fill.position.set(2, -0.5, 1);
    scene.add(fill);

    // Root Group
    const root = new THREE.Group();
    scene.add(root);
    root.position.y = -0.15;

    // Materials based on config
    const skinColor = new THREE.Color(avatarConfig.skinTone || '#E0AC69');
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.5,
      metalness: 0.05,
    });

    const hairColor = new THREE.Color(avatarConfig.hairColor || '#1A1A1A');
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.65,
    });

    const clothColor = new THREE.Color(avatarConfig.clothingColor || '#00f0ff');
    const clothMat = new THREE.MeshStandardMaterial({
      color: clothColor,
      roughness: 0.6,
      metalness: 0.15,
    });

    const innerClothMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.7,
    });

    // Torso / Clothing
    const isFemale = avatarConfig.gender === 'female';
    const shoulderWidth = isFemale ? 0.78 : 0.95;

    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 0.45, 0);
    root.add(chestGroup);

    const bodyGeo = new THREE.CylinderGeometry(0.38, shoulderWidth * 0.55, 0.85, 24);
    const bodyMesh = new THREE.Mesh(bodyGeo, clothMat);
    chestGroup.add(bodyMesh);

    // Inner shirt / collar
    const collarGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.3, 16);
    const collarMesh = new THREE.Mesh(collarGeo, innerClothMat);
    collarMesh.position.set(0, 0.4, 0.02);
    chestGroup.add(collarMesh);

    // Cyber hoodie or tech details
    if (avatarConfig.clothingStyle === 'cyber-hoodie') {
      const hoodGeo = new THREE.TorusGeometry(0.32, 0.08, 16, 24);
      const hoodMesh = new THREE.Mesh(hoodGeo, clothMat);
      hoodMesh.rotation.x = Math.PI / 2.3;
      hoodMesh.position.set(0, 0.45, -0.05);
      chestGroup.add(hoodMesh);

      const glowLineGeo = new THREE.TorusGeometry(0.34, 0.015, 8, 32);
      const glowLineMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const glowLine = new THREE.Mesh(glowLineGeo, glowLineMat);
      glowLine.rotation.x = Math.PI / 2.3;
      glowLine.position.set(0, 0.45, -0.04);
      chestGroup.add(glowLine);
    } else if (avatarConfig.clothingStyle === 'tech-blazer' || avatarConfig.clothingStyle === 'formal-suit') {
      // Lapel triangles
      const lapelGeo = new THREE.ConeGeometry(0.12, 0.5, 4);
      const lapelMesh = new THREE.Mesh(lapelGeo, innerClothMat);
      lapelMesh.position.set(0.12, 0.28, 0.2);
      lapelMesh.rotation.z = 0.3;
      chestGroup.add(lapelMesh);

      const lapelMesh2 = lapelMesh.clone();
      lapelMesh2.position.set(-0.12, 0.28, 0.2);
      lapelMesh2.rotation.z = -0.3;
      chestGroup.add(lapelMesh2);
    }

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.35, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 0.88, 0);
    root.add(neckMesh);

    // Head Group (bobs & tilts)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.35, 0);
    root.add(headGroup);

    // Head Mesh
    const headGeo = new THREE.SphereGeometry(0.48, 32, 32);
    headGeo.scale(1.0, isFemale ? 1.08 : 1.15, 1.02);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(headMesh);

    // Chin definition for male
    if (!isFemale) {
      const jawGeo = new THREE.BoxGeometry(0.34, 0.25, 0.32);
      const jawMesh = new THREE.Mesh(jawGeo, skinMat);
      jawMesh.position.set(0, -0.38, 0.12);
      headGroup.add(jawMesh);
    }

    // Eyes Group & Eyelids (Blinking animation)
    const eyesGroup = new THREE.Group();
    headGroup.add(eyesGroup);

    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.1 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

    // Left eye
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
    leftEye.position.set(-0.18, 0.05, 0.42);
    eyesGroup.add(leftEye);

    const leftIris = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), eyeIrisMat);
    leftIris.position.set(-0.18, 0.05, 0.495);
    eyesGroup.add(leftIris);

    const leftPupil = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), pupilMat);
    leftPupil.position.set(-0.18, 0.05, 0.498);
    eyesGroup.add(leftPupil);

    // Right eye
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
    rightEye.position.set(0.18, 0.05, 0.42);
    eyesGroup.add(rightEye);

    const rightIris = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), eyeIrisMat);
    rightIris.position.set(0.18, 0.05, 0.495);
    eyesGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), pupilMat);
    rightPupil.position.set(0.18, 0.05, 0.498);
    eyesGroup.add(rightPupil);

    // Eyelids for blinking
    const eyelidGeo = new THREE.SphereGeometry(0.085, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidLeft = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidLeft.position.set(-0.18, 0.05, 0.42);
    eyelidLeft.rotation.x = Math.PI;
    headGroup.add(eyelidLeft);

    const eyelidRight = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidRight.position.set(0.18, 0.05, 0.42);
    eyelidRight.rotation.x = Math.PI;
    headGroup.add(eyelidRight);

    // Eyebrows
    const browMat = new THREE.MeshBasicMaterial({ color: hairColor });
    const browGeo = new THREE.BoxGeometry(0.15, 0.025, 0.03);
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.18, 0.17, 0.44);
    leftBrow.rotation.z = 0.08;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.18, 0.17, 0.44);
    rightBrow.rotation.z = -0.08;
    headGroup.add(rightBrow);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.06, 0.15, 8);
    const noseMesh = new THREE.Mesh(noseGeo, skinMat);
    noseMesh.position.set(0, -0.04, 0.48);
    headGroup.add(noseMesh);

    // Mouth / Smile
    const mouthGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI * 0.7);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 });
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.position.set(0, -0.19, 0.43);
    mouthMesh.rotation.z = Math.PI * 1.15;
    headGroup.add(mouthMesh);

    // HAIRSTYLE MESHES
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    if (avatarConfig.hairStyle === 'buzz') {
      const buzzGeo = new THREE.SphereGeometry(0.51, 24, 24);
      buzzGeo.scale(1.02, 1.05, 1.02);
      const buzz = new THREE.Mesh(buzzGeo, hairMat);
      buzz.position.set(0, 0.1, -0.02);
      hairGroup.add(buzz);
    } else if (avatarConfig.hairStyle === 'fade' || avatarConfig.hairStyle === 'slick') {
      const topHairGeo = new THREE.BoxGeometry(0.72, 0.32, 0.75);
      const topHair = new THREE.Mesh(topHairGeo, hairMat);
      topHair.position.set(0, 0.48, 0);
      hairGroup.add(topHair);

      const sideL = new THREE.BoxGeometry(0.08, 0.38, 0.65);
      const sideMeshL = new THREE.Mesh(sideL, hairMat);
      sideMeshL.position.set(-0.46, 0.28, 0);
      hairGroup.add(sideMeshL);

      const sideMeshR = sideMeshL.clone();
      sideMeshR.position.x = 0.46;
      hairGroup.add(sideMeshR);
    } else if (avatarConfig.hairStyle === 'tousled') {
      // Multiple textured volumes
      for (let i = 0; i < 5; i++) {
        const clumpGeo = new THREE.SphereGeometry(0.24, 12, 12);
        const clump = new THREE.Mesh(clumpGeo, hairMat);
        clump.position.set((i - 2) * 0.16, 0.46 + (i % 2) * 0.08, (i % 3) * 0.1);
        hairGroup.add(clump);
      }
    } else if (avatarConfig.hairStyle === 'waves' || avatarConfig.hairStyle === 'bob') {
      const crownGeo = new THREE.SphereGeometry(0.53, 24, 24);
      crownGeo.scale(1.05, 1.1, 1.05);
      const crown = new THREE.Mesh(crownGeo, hairMat);
      crown.position.set(0, 0.12, 0);
      hairGroup.add(crown);

      // Cascading strands
      const strandGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.85, 12);
      const leftStrand = new THREE.Mesh(strandGeo, hairMat);
      leftStrand.position.set(-0.46, -0.05, 0.05);
      hairGroup.add(leftStrand);

      const rightStrand = leftStrand.clone();
      rightStrand.position.x = 0.46;
      hairGroup.add(rightStrand);
    }

    // GLASSES
    if (avatarConfig.glasses === 'tech-frames' || avatarConfig.glasses === 'round-wire') {
      const frameMat = new THREE.MeshStandardMaterial({
        color: avatarConfig.glasses === 'round-wire' ? 0xd4af37 : 0x0f172a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        transmission: 0.9,
      });

      const leftLens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), glassMat);
      leftLens.rotation.x = Math.PI / 2;
      leftLens.position.set(-0.19, 0.05, 0.52);
      headGroup.add(leftLens);

      const rightLens = leftLens.clone();
      rightLens.position.x = 0.19;
      headGroup.add(rightLens);

      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), frameMat);
      bridge.position.set(0, 0.05, 0.52);
      headGroup.add(bridge);
    } else if (avatarConfig.glasses === 'ar-visor') {
      const visorGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.14, 24, 1, true, -1.2, 2.4);
      const visorMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
      });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 0.06, 0.08);
      headGroup.add(visor);
    }

    // ACCESSORIES
    if (avatarConfig.accessory === 'headphones') {
      const bandGeo = new THREE.TorusGeometry(0.55, 0.04, 12, 32, Math.PI);
      const phoneMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7 });
      const band = new THREE.Mesh(bandGeo, phoneMat);
      band.position.set(0, 0.18, 0);
      headGroup.add(band);

      const earCupGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16);
      const cupL = new THREE.Mesh(earCupGeo, phoneMat);
      cupL.rotation.z = Math.PI / 2;
      cupL.position.set(-0.55, 0.08, 0);
      headGroup.add(cupL);

      const cupR = cupL.clone();
      cupR.position.x = 0.55;
      headGroup.add(cupR);
    } else if (avatarConfig.accessory === 'neural-pin') {
      const pinGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(0.42, 0.22, 0.28);
      headGroup.add(pin);
    }

    // Mouse movement tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(nx, -1, 1);
      mouse.targetY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Breathing animation (chest & subtle head rise)
      const breath = Math.sin(time * 2.2) * 0.02;
      chestGroup.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);

      // Head idle movement + mouse look
      headGroup.rotation.y = Math.sin(time * 0.8) * 0.04 + mouse.x * 0.35;
      headGroup.rotation.x = Math.sin(time * 1.4) * 0.02 - mouse.y * 0.2;
      headGroup.position.y = 1.35 + breath * 0.5;

      // Blinking animation (periodic quick close)
      const blinkCycle = (Math.sin(time * 0.6) + 1) * 0.5;
      const isBlinking = blinkCycle > 0.96;
      const eyelidPos = isBlinking ? 0.05 : 0.12;
      eyelidLeft.position.y = eyelidPos;
      eyelidRight.position.y = eyelidPos;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [avatarConfig, interactive]);

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72 lg:w-84 lg:h-84',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center ${sizeClasses}`}
    />
  );
};
