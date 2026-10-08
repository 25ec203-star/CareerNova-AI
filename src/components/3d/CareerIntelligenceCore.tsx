import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface NodeInfo {
  id: string;
  label: string;
  tab: NavigationTab;
  color: number;
  cssColor: string;
  iconName: string;
}

const NODES_DATA: NodeInfo[] = [
  { id: 'profile', label: 'Profile', tab: 'profile', color: 0x38bdf8, cssColor: '#38bdf8', iconName: 'User' },
  { id: 'skills', label: 'Skills', tab: 'skill-assessment', color: 0x10b981, cssColor: '#10b981', iconName: 'Award' },
  { id: 'coding', label: 'Coding', tab: 'coding-arena', color: 0xa855f7, cssColor: '#a855f7', iconName: 'Code' },
  { id: 'aptitude', label: 'Aptitude', tab: 'aptitude', color: 0xf59e0b, cssColor: '#f59e0b', iconName: 'Brain' },
  { id: 'resume', label: 'Resume', tab: 'resume-ai', color: 0x06b6d4, cssColor: '#06b6d4', iconName: 'FileText' },
  { id: 'projects', label: 'Projects', tab: 'profile', color: 0xec4899, cssColor: '#ec4899', iconName: 'FolderGit2' },
  { id: 'techInterview', label: 'Technical Interview', tab: 'tech-interview', color: 0x6366f1, cssColor: '#6366f1', iconName: 'Cpu' },
  { id: 'hrInterview', label: 'HR Interview', tab: 'hr-interview', color: 0x14b8a6, cssColor: '#14b8a6', iconName: 'Users' },
  { id: 'roadmap', label: 'Career Roadmap', tab: 'roadmap', color: 0x8b5cf6, cssColor: '#8b5cf6', iconName: 'Compass' },
  { id: 'companies', label: 'Companies', tab: 'companies', color: 0xf43f5e, cssColor: '#f43f5e', iconName: 'Building2' },
];

export const CareerIntelligenceCore: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, setCurrentTab } = useApp();
  const [hoveredNode, setHoveredNode] = useState<{ id: string; label: string; active: boolean; cssColor: string } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, compact ? 7.2 : 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x00f0ff, 3, 10);
    scene.add(coreLight);

    // Central Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing sphere
    const innerCoreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // Wireframe Outer Geodesic Sphere
    const wireGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireSphere);

    // Orbit Ring
    const orbitRingGeo = new THREE.TorusGeometry(2.35, 0.015, 16, 100);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    scene.add(orbitRing);

    // Orbit Ring 2
    const orbitRing2 = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing2.rotation.x = -Math.PI / 2.8;
    orbitRing2.rotation.y = 0.4;
    scene.add(orbitRing2);

    // Particle dust cloud inside the core
    const coreParticleCount = 90;
    const coreParticleGeo = new THREE.BufferGeometry();
    const coreParticlePositions = new Float32Array(coreParticleCount * 3);
    for (let i = 0; i < coreParticleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.9;
      const sinPhi = Math.sin(phi);
      coreParticlePositions[i * 3] = r * sinPhi * Math.cos(theta);
      coreParticlePositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      coreParticlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    coreParticleGeo.setAttribute('position', new THREE.BufferAttribute(coreParticlePositions, 3));
    const coreParticleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });
    const coreParticles = new THREE.Points(coreParticleGeo, coreParticleMat);
    coreGroup.add(coreParticles);

    // 10 PERIPHERAL NODES
    const nodeMeshes: {
      group: THREE.Group;
      data: NodeInfo;
      line: THREE.Line;
      orb: THREE.Mesh;
      glowRing: THREE.Mesh;
      baseAngle: number;
      radius: number;
      yOffset: number;
      isActive: boolean;
    }[] = [];

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    NODES_DATA.forEach((node, idx) => {
      const isActive = !!state.activeNodes[node.id as keyof typeof state.activeNodes];
      const nodeGroup = new THREE.Group();
      nodesGroup.add(nodeGroup);

      // Node sphere
      const nodeGeo = new THREE.SphereGeometry(compact ? 0.22 : 0.26, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isActive ? node.color : 0x1e293b,
        emissive: isActive ? node.color : 0x090d16,
        emissiveIntensity: isActive ? 1.4 : 0.05,
        roughness: isActive ? 0.2 : 0.8,
        metalness: isActive ? 0.4 : 0.1,
        transparent: true,
        opacity: isActive ? 1.0 : 0.45,
      });
      const orbMesh = new THREE.Mesh(nodeGeo, nodeMat);
      orbMesh.userData = { nodeId: node.id, label: node.label, tab: node.tab, isActive, cssColor: node.cssColor };
      nodeGroup.add(orbMesh);

      // Outer glow pulse ring
      const glowRingGeo = new THREE.RingGeometry(0.32, 0.38, 32);
      const glowRingMat = new THREE.MeshBasicMaterial({
        color: isActive ? node.color : 0x334155,
        transparent: true,
        opacity: isActive ? 0.7 : 0.15,
        side: THREE.DoubleSide,
      });
      const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
      nodeGroup.add(glowRing);

      // Connection line to central core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: isActive ? node.color : 0x1e293b,
        transparent: true,
        opacity: isActive ? 0.65 : 0.1,
        linewidth: 1,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      const angle = (idx / NODES_DATA.length) * Math.PI * 2;
      const radius = compact ? 2.3 : 2.65;
      const yOffset = ((idx % 3) - 1) * (compact ? 0.65 : 0.85);

      nodeMeshes.push({
        group: nodeGroup,
        data: node,
        line,
        orb: orbMesh,
        glowRing,
        baseAngle: angle,
        radius,
        yOffset,
        isActive,
      });
    });

    // Raycaster for click and hover interaction
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mousePos, camera);
      const orbs = nodeMeshes.map((n) => n.orb);
      const intersects = raycaster.intersectObjects(orbs);

      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        container.style.cursor = 'pointer';
        setHoveredNode({
          id: data.nodeId,
          label: data.label,
          active: data.isActive,
          cssColor: data.cssColor,
        });
      } else {
        container.style.cursor = 'default';
        setHoveredNode(null);
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mousePos, camera);
      const orbs = nodeMeshes.map((n) => n.orb);
      const intersects = raycaster.intersectObjects(orbs);
      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        setCurrentTab(data.tab);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

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

      // Core rotation & breathe
      coreGroup.rotation.y = time * 0.25;
      wireSphere.rotation.x = time * 0.15;
      wireSphere.rotation.z = time * 0.1;
      const coreScale = 1 + Math.sin(time * 2.5) * 0.03;
      coreGroup.scale.set(coreScale, coreScale, coreScale);

      // Core light pulse
      coreLight.intensity = 2.2 + Math.sin(time * 3) * 0.8;

      // Position nodes in orbit
      nodeMeshes.forEach((item) => {
        const curAngle = item.baseAngle + time * 0.12;
        const x = Math.cos(curAngle) * item.radius;
        const z = Math.sin(curAngle) * item.radius;
        const y = item.yOffset + Math.sin(time * 1.5 + item.baseAngle) * 0.15;

        item.group.position.set(x, y, z);
        item.glowRing.quaternion.copy(camera.quaternion);

        // Pulse active glow ring
        if (item.isActive) {
          const ringScale = 1 + Math.sin(time * 4 + item.baseAngle) * 0.2;
          item.glowRing.scale.set(ringScale, ringScale, 1);
        }

        // Update connection line
        const linePositions = item.line.geometry.attributes.position as THREE.BufferAttribute;
        linePositions.setXYZ(0, 0, 0, 0); // Core
        linePositions.setXYZ(1, x, y, z); // Node
        linePositions.needsUpdate = true;
      });

      // Mouse camera drift
      camera.position.x += (mousePos.x * 0.4 - camera.position.x) * 0.05;
      camera.position.y += (mousePos.y * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [state.activeNodes, compact, setCurrentTab]);

  const activeCount = Object.values(state.activeNodes).filter(Boolean).length;

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* Floating HUD info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
          AI Career Intelligence Core
        </div>
        <div className="text-sm text-slate-400 font-mono tabular-nums">
          {activeCount} of 10 Nodes Activated
        </div>
      </div>

      {/* Node tooltip on hover */}
      {hoveredNode && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl pointer-events-none flex items-center gap-3 transition-all"
          style={{ borderColor: hoveredNode.active ? hoveredNode.cssColor : '#475569' }}
        >
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: hoveredNode.active ? hoveredNode.cssColor : '#64748b' }}
          />
          <div>
            <div className="text-sm font-semibold text-white">{hoveredNode.label}</div>
            <div className="text-xs text-slate-400 font-mono">
              Status: {hoveredNode.active ? 'Active & Calibrated' : 'Inactive (Complete activity to unlock)'}
            </div>
          </div>
          <span className="text-xs text-cyan-400 ml-2">Click to open →</span>
        </div>
      )}

      {/* Legend footer */}
      <div className="absolute bottom-3 right-4 z-10 pointer-events-none text-[11px] text-slate-500 flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          Active Node
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          Inactive Node
        </span>
      </div>
    </div>
  );
};
