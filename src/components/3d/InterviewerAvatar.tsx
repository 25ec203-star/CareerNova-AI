import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InterviewerAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  type?: 'Technical' | 'HR';
}

export const InterviewerAvatar: React.FC<InterviewerAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  type = 'Technical',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Studio lights
    const ambient = new THREE.AmbientLight(0x2a3563, 1.5);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2, 3, 3);
    scene.add(key);

    const rimColor = type === 'Technical' ? 0x00f0ff : 0xec4899;
    const rim = new THREE.PointLight(rimColor, 3.2, 8);
    rim.position.set(-2.5, 2, -1);
    scene.add(rim);

    // AI Avatar Character
    const root = new THREE.Group();
    scene.add(root);
    root.position.y = -0.15;

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf0cbb3,
      roughness: 0.45,
    });

    const suitColor = type === 'Technical' ? 0x0f172a : 0x1e1b4b;
    const suitMat = new THREE.MeshStandardMaterial({
      color: suitColor,
      roughness: 0.6,
      metalness: 0.2,
    });

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 0.9, 24), suitMat);
    body.position.set(0, 0.45, 0);
    root.add(body);

    // Cyber lapel badge
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.02),
      new THREE.MeshBasicMaterial({ color: rimColor })
    );
    badge.position.set(0.2, 0.65, 0.26);
    root.add(badge);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.35, 16), skinMat);
    neck.position.set(0, 0.88, 0);
    root.add(neck);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.35, 0);
    root.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 32), skinMat);
    head.scale.set(1.0, 1.15, 1.05);
    headGroup.add(head);

    // Smart Glass / Earpiece
    const earpiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
      new THREE.MeshBasicMaterial({ color: rimColor })
    );
    earpiece.rotation.z = Math.PI / 2;
    earpiece.position.set(0.48, 0.05, 0);
    headGroup.add(earpiece);

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.6 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), hairMat);
    hair.scale.set(1.04, 1.12, 1.04);
    hair.position.set(0, 0.1, -0.04);
    headGroup.add(hair);

    // Eyes
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: rimColor,
      emissive: rimColor,
      emissiveIntensity: 0.4,
    });

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
    eyeL.position.set(-0.18, 0.05, 0.42);
    headGroup.add(eyeL);

    const irisL = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), eyeIrisMat);
    irisL.position.set(-0.18, 0.05, 0.495);
    headGroup.add(irisL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
    eyeR.position.set(0.18, 0.05, 0.42);
    headGroup.add(eyeR);

    const irisR = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), eyeIrisMat);
    irisR.position.set(0.18, 0.05, 0.495);
    headGroup.add(irisR);

    // Eyelids
    const eyelidGeo = new THREE.SphereGeometry(0.085, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lidL = new THREE.Mesh(eyelidGeo, skinMat);
    lidL.position.set(-0.18, 0.05, 0.42);
    lidL.rotation.x = Math.PI;
    headGroup.add(lidL);

    const lidR = new THREE.Mesh(eyelidGeo, skinMat);
    lidR.position.set(0.18, 0.05, 0.42);
    lidR.rotation.x = Math.PI;
    headGroup.add(lidR);

    // Dynamic Mouth for speech animation
    const mouthMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
      new THREE.MeshBasicMaterial({ color: 0x881337 })
    );
    mouthMesh.rotation.x = Math.PI / 2;
    mouthMesh.position.set(0, -0.19, 0.45);
    headGroup.add(mouthMesh);

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

      // Blinking
      const blinkCycle = (Math.sin(time * 0.5) + 1) * 0.5;
      const isBlinking = blinkCycle > 0.96;
      lidL.position.y = isBlinking ? 0.05 : 0.12;
      lidR.position.y = isBlinking ? 0.05 : 0.12;

      // Speaking mouth motion
      if (isSpeaking) {
        const mouthOpen = 0.5 + Math.abs(Math.sin(time * 12)) * 0.9;
        mouthMesh.scale.set(1.1, mouthOpen, 1);
        headGroup.rotation.x = Math.sin(time * 8) * 0.04;
      } else {
        mouthMesh.scale.set(1, 0.2, 1);
        headGroup.rotation.x = Math.sin(time * 1.2) * 0.02;
      }

      // Listening attentive head tilt
      if (isListening) {
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.12, 0.05);
        headGroup.rotation.y = Math.sin(time * 1.5) * 0.03;
      } else {
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.05);
        headGroup.rotation.y = Math.sin(time * 0.8) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isSpeaking, isListening, type]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[260px] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-950/40"
    />
  );
};
