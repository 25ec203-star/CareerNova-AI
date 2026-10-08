import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import pandaTransparentPng from '../../assets/images/panda_transparent.png';
import { Sparkles, Music, Volume2, VolumeX, Flame, Heart, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DancingPandaProps {
  isWavingSuccess?: boolean;
}

export const DancingPanda: React.FC<DancingPandaProps> = ({ isWavingSuccess = false }) => {
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pandaImgRef = useRef<HTMLImageElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [danceTempo, setDanceTempo] = useState<'normal' | 'hype'>('normal');
  const [danceStep, setDanceStep] = useState(0);
  const [cheerCount, setCheerCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // 3D Immersive Futuristic WebGL Background (Particle Grid & Orbiting Geometric Field)
  useEffect(() => {
    const canvas = threeCanvasRef.current;
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
    scene.fog = new THREE.FogExp2(0x060814, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.6);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 4, 15);
    cyanPointLight.position.set(-3, 2, 2);
    scene.add(cyanPointLight);

    const magentaPointLight = new THREE.PointLight(0xd946ef, 3.5, 15);
    magentaPointLight.position.set(3, -2, 1);
    scene.add(magentaPointLight);

    const centerGlow = new THREE.PointLight(0x38bdf8, 3, 10);
    centerGlow.position.set(0, 0.5, 0);
    scene.add(centerGlow);

    // 1. Futuristic Wave Particle Grid (Undulating cyber floor)
    const gridCols = 40;
    const gridRows = 40;
    const gridCount = gridCols * gridRows;
    const gridGeo = new THREE.BufferGeometry();
    const gridPos = new Float32Array(gridCount * 3);
    const gridColors = new Float32Array(gridCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0x8b5cf6);

    let idx = 0;
    for (let i = 0; i < gridCols; i++) {
      for (let j = 0; j < gridRows; j++) {
        const x = (i - gridCols / 2) * 0.45;
        const z = (j - gridRows / 2) * 0.45;
        gridPos[idx * 3] = x;
        gridPos[idx * 3 + 1] = -2.2;
        gridPos[idx * 3 + 2] = z;

        const mixRatio = Math.sin(x * 0.3) * 0.5 + 0.5;
        const c = colorCyan.clone().lerp(colorPurple, mixRatio);
        gridColors[idx * 3] = c.r;
        gridColors[idx * 3 + 1] = c.g;
        gridColors[idx * 3 + 2] = c.b;
        idx++;
      }
    }
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPos, 3));
    gridGeo.setAttribute('color', new THREE.BufferAttribute(gridColors, 3));

    const gridMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const gridPoints = new THREE.Points(gridGeo, gridMat);
    scene.add(gridPoints);

    // 2. Holographic Concentric Dance Rings on the floor
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, -1.8, 0);
    ringsGroup.rotation.x = Math.PI / 2;
    scene.add(ringsGroup);

    const ringRadii = [1.2, 1.8, 2.4, 3.0];
    const ringMeshes: THREE.Mesh[] = [];

    ringRadii.forEach((r, i) => {
      const ringGeo = new THREE.RingGeometry(r - 0.02, r + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xd946ef,
        transparent: true,
        opacity: 0.4 - i * 0.08,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ringsGroup.add(ring);
      ringMeshes.push(ring);
    });

    // 3. Floating Holographic Particles (Ambient Constellation)
    const starCount = 140;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 12;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 8 + 0.5;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 4. Subtle Wireframe Geometric Polyhedra orbiting in space
    const polyGroup = new THREE.Group();
    scene.add(polyGroup);

    const polyGeo = new THREE.IcosahedronGeometry(0.25, 0);
    const polyMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const polys: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(polyGeo, polyMat);
      const angle = (i / 6) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 3.5, ((i % 3) - 1) * 1.5, Math.sin(angle) * 2 - 1);
      polyGroup.add(p);
      polys.push(p);
    }

    // Resize Handler
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

      // Undulate Cyber Grid Floor
      const positions = gridPoints.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < gridCount; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const waveY =
          -2.2 +
          Math.sin(x * 0.8 + time * 2.2) * 0.18 +
          Math.cos(z * 0.8 + time * 1.8) * 0.18;
        positions.setY(i, waveY);
      }
      positions.needsUpdate = true;

      // Pulse Stage Concentric Rings
      ringMeshes.forEach((ring, i) => {
        const pulse = 1 + Math.sin(time * 3 + i * 0.8) * 0.05;
        ring.scale.set(pulse, pulse, 1);
      });
      ringsGroup.rotation.z = time * 0.15;

      // Ambient Particles Drift
      starPoints.rotation.y = time * 0.03;

      // Orbiting Wireframe Polys
      polyGroup.rotation.y = time * 0.08;
      polys.forEach((p, i) => {
        p.rotation.x += 0.01 * (i + 1);
        p.rotation.y += 0.015 * (i + 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Dance beat rhythm ticker
  useEffect(() => {
    const speed = danceTempo === 'hype' ? 240 : 420;
    const interval = setInterval(() => {
      setDanceStep((s) => (s + 1) % 4);
    }, speed);
    return () => clearInterval(interval);
  }, [danceTempo]);

  // Track cursor for 3D card tilt & parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleCheerPanda = () => {
    setCheerCount((c) => c + 1);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 900);

    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#00f0ff', '#d946ef', '#38bdf8', '#ffffff'],
    });
  };

  // Dynamic rhythmic dance metrics (step 0: ground, step 1: hop-left, step 2: ground, step 3: hop-right)
  const bounceY = danceStep % 2 === 1 ? (danceTempo === 'hype' ? -22 : -14) : 0;
  const tiltDeg =
    danceStep === 1
      ? danceTempo === 'hype'
        ? 5.5
        : 3.5
      : danceStep === 3
      ? danceTempo === 'hype'
        ? -5.5
        : -3.5
      : 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] lg:min-h-[540px] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* 3D WEBGL INTERACTIVE FUTURISTIC BACKGROUND */}
      <canvas
        ref={threeCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Atmospheric Radial Color Blooms */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      {/* MAIN PANDA CHARACTER STAGE - 100% ISOLATED (NO BACKGROUND, NO BOX, NO CODES/AI/RESUME BADGES) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Holographic Glowing Stage Ring Directly Under Panda's Feet */}
        <div className="relative flex flex-col items-center">
          {/* Floor Ring Glow */}
          <div
            className="absolute -bottom-6 w-64 sm:w-72 h-16 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/25 to-pink-500/30 blur-md transition-all duration-300 pointer-events-none"
            style={{
              transform: `scale(${1 + Math.abs(bounceY) * 0.02})`,
            }}
          />

          {/* Dancing Panda - 100% Transparent Cutout */}
          <div
            onClick={handleCheerPanda}
            title="Click to cheer the dancing panda!"
            className={`relative cursor-pointer transition-transform duration-200 ease-out ${
              isSpinning ? 'animate-spin' : ''
            }`}
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${
                -mousePos.y * 8
              }deg) translateY(${bounceY}px) rotate(${tiltDeg}deg) scale(${
                isWavingSuccess ? 1.08 : 1
              })`,
            }}
          >
            <img
              ref={pandaImgRef}
              src={pandaTransparentPng}
              alt="CareerNova Dancing Panda"
              referrerPolicy="no-referrer"
              className="w-[280px] sm:w-[330px] lg:w-[360px] h-auto object-contain pointer-events-auto filter drop-shadow-[0_20px_35px_rgba(0,240,255,0.35)]"
            />

            {/* Sparkle burst on cheer */}
            {cheerCount > 0 && (
              <div className="absolute -top-4 right-2 text-cyan-300 font-mono text-xs font-bold animate-ping">
                +{cheerCount}
              </div>
            )}
          </div>
        </div>

        {/* MODERN UI/UX INTERACTIVE CONTROL DOCK */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 z-20 px-4">
          {/* Cheer Button with Heart micro-interaction */}
          <button
            onClick={handleCheerPanda}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-1.5 cursor-pointer hover:border-cyan-400"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
            <span>Cheer Nova</span>
            {cheerCount > 0 && (
              <span className="font-mono text-[10px] text-cyan-400 ml-0.5">({cheerCount})</span>
            )}
          </button>

          {/* Tempo Selector (Groove vs Hype Mode) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono">
            <button
              onClick={() => setDanceTempo('normal')}
              type="button"
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                danceTempo === 'normal'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3 h-3 text-cyan-400" />
              Groove
            </button>
            <button
              onClick={() => setDanceTempo('hype')}
              type="button"
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                danceTempo === 'hype'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-purple-400" />
              Hype
            </button>
          </div>

          {/* Real-time Beat Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                danceStep % 2 === 0 ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-slate-700'
              }`}
            />
            <span>Beat {danceStep + 1}/4</span>
          </div>
        </div>

        {/* Subtitle UX Tag */}
        <p className="text-[11px] text-slate-500 font-mono mt-2 tracking-wider uppercase">
          Interactive AI Companion · Tap panda to celebrate
        </p>
      </div>
    </div>
  );
};
