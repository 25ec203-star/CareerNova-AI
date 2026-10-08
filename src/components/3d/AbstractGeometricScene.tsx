import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AbstractGeometricScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 16);
    cyanLight.position.set(-4, 3, 2);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3, 16);
    purpleLight.position.set(4, -3, 1);
    scene.add(purpleLight);

    const rimLight = new THREE.PointLight(0xec4899, 2, 12);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // 1. FLOATING GEOMETRIC OBJECTS (Icosahedrons, Octahedrons, Tetrahedrons, Rings)
    const geometricGroup = new THREE.Group();
    scene.add(geometricGroup);

    interface FloatingPoly {
      mesh: THREE.Mesh;
      wireMesh?: THREE.LineSegments;
      rotSpeed: { x: number; y: number; z: number };
      floatSpeed: number;
      initY: number;
      orbitRadius: number;
      orbitAngle: number;
    }

    const floatingObjects: FloatingPoly[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.35, 0),
      new THREE.OctahedronGeometry(0.38, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
      new THREE.TorusGeometry(0.32, 0.08, 16, 32),
      new THREE.DodecahedronGeometry(0.32, 0),
    ];

    const polyMaterials = [
      new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.85,
        transparent: true,
        opacity: 0.6,
        wireframe: false,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6,
        metalness: 0.3,
        roughness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.55,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xec4899,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.9,
        transparent: true,
        opacity: 0.5,
      }),
    ];

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });

    for (let i = 0; i < 18; i++) {
      const geo = geometries[i % geometries.length];
      const mat = polyMaterials[i % polyMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);

      const wireGeo = new THREE.WireframeGeometry(geo);
      const wire = new THREE.LineSegments(wireGeo, wireMaterial);
      mesh.add(wire);

      const orbitRadius = 2.4 + Math.random() * 3.8;
      const orbitAngle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
      const x = Math.cos(orbitAngle) * orbitRadius;
      const y = (Math.random() - 0.5) * 5;
      const z = Math.sin(orbitAngle) * (orbitRadius * 0.7) - 1.5;

      mesh.position.set(x, y, z);
      const scale = 0.6 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, scale);

      geometricGroup.add(mesh);

      floatingObjects.push({
        mesh,
        wireMesh: wire,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.012,
        },
        floatSpeed: 0.8 + Math.random() * 0.6,
        initY: y,
        orbitRadius,
        orbitAngle,
      });
    }

    // 2. CONSTELLATION NEURAL NETWORK PARTICLES
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const baseCyan = new THREE.Color(0x00f0ff);
    const basePurple = new THREE.Color(0xa855f7);
    const basePink = new THREE.Color(0xf43f5e);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;

      const pick = Math.random();
      const col = pick < 0.45 ? baseCyan : pick < 0.8 ? basePurple : basePink;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 3. CENTRAL FAINT NEURAL RINGS (Subtle abstract orbital core)
    const neuralRingsGroup = new THREE.Group();
    scene.add(neuralRingsGroup);
    neuralRingsGroup.position.set(-1.8, 0, -2);

    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    neuralRingsGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(4.0, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = 0.5;
    neuralRingsGroup.add(ring2);

    // Mouse tracking for subtle parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = nx;
      mouse.targetY = ny;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Animate floating geometric polyhedra
      floatingObjects.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        // Gentle floating drift
        item.mesh.position.y = item.initY + Math.sin(time * item.floatSpeed + idx) * 0.4;
      });

      // Slowly rotate geometric cluster
      geometricGroup.rotation.y = time * 0.03 + mouse.x * 0.15;
      geometricGroup.rotation.x = mouse.y * 0.1;

      // Drift particle constellation
      particleSystem.rotation.y = time * 0.015;
      particleSystem.rotation.x = time * 0.01;

      // Orbital neural rings
      ring1.rotation.z = time * 0.06;
      ring2.rotation.z = -time * 0.04;
      neuralRingsGroup.rotation.y = mouse.x * 0.2;

      // Dynamic light sweep
      cyanLight.position.x = -4 + Math.sin(time * 0.8) * 1.5;
      purpleLight.position.y = -3 + Math.cos(time * 0.7) * 1.5;

      // Camera parallax
      camera.position.x = mouse.x * 0.4;
      camera.position.y = mouse.y * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
