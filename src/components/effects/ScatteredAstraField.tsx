import React, { useEffect, useRef, useState } from 'react';

export const ScatteredAstraField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [astraIntensity, setAstraIntensity] = useState<'calm' | 'radiant' | 'supernova'>('radiant');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Astra Particle Definition
    interface AstraParticle {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      vx: number;
      vy: number;
      twinkleSpeed: number;
      twinklePhase: number;
      isSuperStar?: boolean;
      pulseAngle: number;
    }

    // Shooting Star Definition
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      color: string;
      trailWidth: number;
    }

    const countFactor = astraIntensity === 'calm' ? 80 : astraIntensity === 'radiant' ? 140 : 200;
    const PARTICLE_COUNT = Math.min(countFactor, Math.floor((width * height) / 9000));
    const particles: AstraParticle[] = [];
    const shootingStars: ShootingStar[] = [];

    const astraColorPalette = [
      'rgba(56, 189, 248, ',   // Sky Cyan
      'rgba(168, 85, 247, ',  // Astral Violet
      'rgba(236, 72, 153, ',  // Magenta Rose
      'rgba(255, 255, 255, ',  // Diamond Star
      'rgba(6, 182, 212, ',   // Electric Blue
      'rgba(129, 140, 248, ',  // Indigo Spark
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isSuper = Math.random() < 0.16;
      const baseR = isSuper ? 1.8 + Math.random() * 1.8 : 0.6 + Math.random() * 1.2;
      const baseA = isSuper ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: baseR,
        baseRadius: baseR,
        color: astraColorPalette[Math.floor(Math.random() * astraColorPalette.length)],
        alpha: baseA,
        baseAlpha: baseA,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        twinkleSpeed: 0.02 + Math.random() * 0.035,
        twinklePhase: Math.random() * Math.PI * 2,
        pulseAngle: Math.random() * Math.PI * 2,
        isSuperStar: isSuper,
      });
    }

    // Spawn a shooting star at intermittent intervals
    let lastShootTime = 0;
    const maybeSpawnShootingStar = (time: number) => {
      if (time - lastShootTime > 3.2 && shootingStars.length < 3 && Math.random() < 0.35) {
        lastShootTime = time;
        const startX = Math.random() * width * 0.9;
        const startY = Math.random() * (height * 0.4);
        shootingStars.push({
          x: startX,
          y: startY,
          length: 90 + Math.random() * 110,
          speed: 9 + Math.random() * 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.35, // ~45 deg down-right
          alpha: 1,
          color: Math.random() > 0.4 ? '#38bdf8' : '#e879f9',
          trailWidth: 1.5 + Math.random() * 1.2,
        });
      }
    };

    // Interactive mouse damping parallax
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.035;
      mouse.y += (mouse.targetY - mouse.y) * 0.035;
      const parallaxX = (mouse.x - width / 2) * 0.025;
      const parallaxY = (mouse.y - height / 2) * 0.025;

      // 1. Constellation Filaments Between Nearby Astra Particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * 0.16 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x + parallaxX, particles[i].y + parallaxY);
            ctx.lineTo(particles[j].x + parallaxX, particles[j].y + parallaxY);
            ctx.stroke();
          }
        }
      }

      // 2. Render Astra Particles with Twinkling Aura & Diffraction Spikes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.twinklePhase += p.twinkleSpeed;
        const twinkle = Math.sin(p.twinklePhase);
        p.alpha = Math.max(0.08, p.baseAlpha + twinkle * 0.3);
        p.radius = Math.max(0.4, p.baseRadius + twinkle * 0.35);

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        // Outer soft astra flare for super stars
        if (p.isSuperStar) {
          const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.radius * 5);
          grad.addColorStop(0, `${p.color}${p.alpha * 0.75})`);
          grad.addColorStop(0.4, `${p.color}${p.alpha * 0.2})`);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius * 5, 0, Math.PI * 2);
          ctx.fill();

          // Delicate Diamond Cross Flare
          ctx.strokeStyle = `${p.color}${p.alpha * 0.5})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(drawX - p.radius * 3.5, drawY);
          ctx.lineTo(drawX + p.radius * 3.5, drawY);
          ctx.moveTo(drawX, drawY - p.radius * 3.5);
          ctx.lineTo(drawX, drawY + p.radius * 3.5);
          ctx.stroke();
        }

        // Core star point
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render Shooting Stars (Astra Meteor Streaks)
      maybeSpawnShootingStar(time);
      for (let sIdx = shootingStars.length - 1; sIdx >= 0; sIdx--) {
        const s = shootingStars[sIdx];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.014;

        if (s.alpha <= 0 || s.x > width || s.y > height) {
          shootingStars.splice(sIdx, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, s.color);
        grad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.trailWidth;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Glowing Star Head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [astraIntensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Scattered Astra Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Atmospheric Cosmic Nebula Blooms */}
      <div className="absolute -top-40 -left-40 w-[640px] h-[640px] bg-gradient-to-br from-cyan-500/12 via-blue-600/8 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[620px] h-[620px] bg-gradient-to-bl from-purple-600/12 via-indigo-600/6 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/10 via-cyan-500/8 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Galactic Dust Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), radial-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0, 24px 24px',
        }}
      />
    </div>
  );
};

