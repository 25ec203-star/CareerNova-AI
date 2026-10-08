import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import pandaTransparentPng from '../../assets/images/panda_transparent.png';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Music,
  Flame,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Minimize2,
  Users,
  User,
  Zap,
  MessageSquare,
  ChevronUp,
} from 'lucide-react';

export const PandaCompanion: React.FC = () => {
  const { currentTab, state } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [squadMode, setSquadMode] = useState<'solo' | 'squad'>('squad');
  const [danceTempo, setDanceTempo] = useState<'groove' | 'hype' | 'breakdance'>('hype');
  const [danceStep, setDanceStep] = useState(0);
  const [cheerCount, setCheerCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number }[]>([]);

  // Synthesized Friendly Audio Chime
  const playChime = (freq = 520) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext not allowed before user gesture
    }
  };

  // Rhythm ticker
  useEffect(() => {
    const speed = danceTempo === 'breakdance' ? 190 : danceTempo === 'hype' ? 260 : 420;
    const interval = setInterval(() => {
      setDanceStep((s) => (s + 1) % 4);
    }, speed);
    return () => clearInterval(interval);
  }, [danceTempo]);

  // Handle cheer interaction
  const handleCheer = () => {
    setCheerCount((c) => c + 1);
    playChime(660);

    const heartId = Date.now();
    setFloatingHeart((prev) => [...prev, { id: heartId, x: (Math.random() - 0.5) * 60 }]);
    setTimeout(() => {
      setFloatingHeart((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x: 0.85, y: 0.8 },
      colors: ['#00f0ff', '#d946ef', '#38bdf8', '#ffffff', '#f43f5e'],
    });
  };

  // Context-aware placement tips from Nova
  const getPandaTip = () => {
    if (state.codingProblemsSolved === 0 && currentTab === 'dashboard') {
      return "Welcome aboard! Solve your first coding challenge or take a skill test to ignite the 3D core!";
    }
    switch (currentTab) {
      case 'dashboard':
        return `Looking sharp, ${state.user.name.split(' ')[0]}! You've earned ${state.xp} XP so far. Keep the momentum going!`;
      case 'coding-arena':
        return "Write modular, clean code! accepted test cases immediately boost your Placement Readiness score 💻";
      case 'aptitude':
        return "Quantitative & logical speed rounds build placement confidence. Accuracy first, speed second!";
      case 'tech-interview':
        return "Our 3D AI Interviewer evaluates communication, technical depth, and structured problem-solving!";
      case 'hr-interview':
        return "Structure behavioral questions with the STAR method (Situation, Task, Action, Result) 🌟";
      case 'resume-ai':
        return "Upload real resumes to scan for high-frequency placement keywords & ATS scoring!";
      case 'career-core':
        return "All 10 orbital nodes reflect your genuine preparation. Dim nodes awaken with every achievement!";
      case 'roadmap':
        return "Follow the milestone path from foundational practice to top-tier company placement prep!";
      case 'ai-mentor':
        return "I'm always strategizing your next career milestone. Ask me anything about recruitment!";
      default:
        return "Placement season is here. Stay consistent, practice daily, and conquer your dream company!";
    }
  };

  // Dance physics
  const bounceY =
    danceTempo === 'breakdance'
      ? Math.sin(danceStep * Math.PI) * -18
      : danceTempo === 'hype'
      ? Math.sin(danceStep * Math.PI) * -14
      : Math.sin(danceStep * Math.PI) * -8;

  const tiltDeg =
    danceTempo === 'breakdance'
      ? (danceStep % 2 === 0 ? 8 : -8)
      : danceTempo === 'hype'
      ? (danceStep % 2 === 0 ? 5 : -5)
      : (danceStep % 2 === 0 ? 2.5 : -2.5);

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* MINIMIZED FLOATING PANDA BADGE */}
      {!isOpen && (
        <div className="relative group">
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60 blur-md group-hover:opacity-100 transition animate-pulse" />

          <button
            onClick={() => {
              setIsOpen(true);
              playChime(580);
            }}
            type="button"
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/40 backdrop-blur-xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer hover:border-cyan-400 transition"
          >
            {/* Animated Mini Panda Mascot */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                src={pandaTransparentPng}
                alt="Nova Panda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)] animate-bounce"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-ping" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-white flex items-center gap-1">
                <span>Nova & Squad</span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-[9px] font-mono text-cyan-300">AI Cheer Companions</div>
            </div>

            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition" />
          </button>
        </div>
      )}

      {/* EXPANDED INTERACTIVE PANDA COMPANION DOCK */}
      {isOpen && (
        <div className="relative w-[340px] sm:w-[410px] rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-cyan-500/30 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {squadMode === 'squad' ? 'Nova Panda Squad 🐾' : 'Nova AI Companion 🐾'}
                </h4>
                <span className="text-[10px] font-mono text-cyan-400">
                  Adaptive Placement Cheerleaders
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                type="button"
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                  soundEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close / Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Minimize"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Context Speech Bubble */}
          {showSpeech && (
            <div className="relative mb-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 flex items-start gap-2.5 shadow-inner">
              <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">{getPandaTip()}</div>
              <button
                onClick={() => setShowSpeech(false)}
                type="button"
                className="text-slate-400 hover:text-white text-[10px]"
                title="Dismiss tip"
              >
                ✕
              </button>
            </div>
          )}

          {/* DANCING PANDA STAGE (SOLO OR MULTI-PANDA SQUAD) */}
          <div className="relative w-full h-[190px] sm:h-[220px] rounded-2xl bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Holographic Glowing Stage Floor Under Feet */}
            <div className="absolute bottom-2 w-48 sm:w-64 h-12 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/20 to-pink-500/30 blur-md pointer-events-none" />

            {/* Stage Laser Light Pillars */}
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent pointer-events-none" />

            {/* Floating Hearts from Cheer */}
            {floatingHeart.map((h) => (
              <div
                key={h.id}
                className="absolute z-30 pointer-events-none animate-fade-in"
                style={{
                  left: `calc(50% + ${h.x}px)`,
                  bottom: '80px',
                  animation: 'floatUp 1.2s ease-out forwards',
                }}
              >
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400/80 filter drop-shadow-[0_0_8px_#f43f5e]" />
              </div>
            ))}

            {/* PANDAS DISPLAY: SOLO OR TRIPLE SQUAD */}
            {squadMode === 'solo' ? (
              /* Single Dancing Panda */
              <div
                onClick={handleCheer}
                title="Click to cheer Nova!"
                className="relative cursor-pointer transition-transform duration-200 ease-out z-10 flex flex-col items-center"
                style={{
                  transform: `translateY(${bounceY}px) rotate(${tiltDeg}deg)`,
                }}
              >
                <img
                  src={pandaTransparentPng}
                  alt="Nova Dancing Panda"
                  referrerPolicy="no-referrer"
                  className="w-32 sm:w-36 h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,240,255,0.45)] hover:scale-105 transition"
                />
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30 mt-[-6px]">
                  Nova (Groove Master)
                </span>
              </div>
            ) : (
              /* Triple Panda Squad (Nova, Astra, Quantum) */
              <div className="relative z-10 w-full flex items-end justify-center gap-2 sm:gap-4 px-2">
                {/* 1. Left Panda: Astra */}
                <div
                  onClick={handleCheer}
                  title="Astra the Violet Cheer Panda"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center opacity-90"
                  style={{
                    transform: `translateY(${
                      danceTempo === 'breakdance'
                        ? Math.sin((danceStep + 1) * Math.PI) * -16
                        : Math.sin((danceStep + 1) * Math.PI) * -10
                    }px) rotate(${-tiltDeg * 0.9}deg) scale(0.85)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Astra Panda"
                    referrerPolicy="no-referrer"
                    className="w-24 sm:w-28 h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(168,85,247,0.4)] hue-rotate-[260deg]"
                  />
                  <span className="text-[9px] font-mono text-purple-300 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-purple-500/30 mt-[-6px]">
                    Astra
                  </span>
                </div>

                {/* 2. Center Panda: Nova */}
                <div
                  onClick={handleCheer}
                  title="Nova - Lead Dancer"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center z-20"
                  style={{
                    transform: `translateY(${bounceY}px) rotate(${tiltDeg}deg) scale(1.05)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Nova Panda"
                    referrerPolicy="no-referrer"
                    className="w-32 sm:w-36 h-auto object-contain filter drop-shadow-[0_14px_28px_rgba(0,240,255,0.5)]"
                  />
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/50 mt-[-6px] shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    Nova ✨
                  </span>
                </div>

                {/* 3. Right Panda: Quantum */}
                <div
                  onClick={handleCheer}
                  title="Quantum the Cyber Cheer Panda"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center opacity-90"
                  style={{
                    transform: `translateY(${
                      danceTempo === 'breakdance'
                        ? Math.sin((danceStep + 2) * Math.PI) * -16
                        : Math.sin((danceStep + 2) * Math.PI) * -10
                    }px) rotate(${tiltDeg * 0.9}deg) scale(0.85)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Quantum Panda"
                    referrerPolicy="no-referrer"
                    className="w-24 sm:w-28 h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(236,72,153,0.4)] hue-rotate-[320deg]"
                  />
                  <span className="text-[9px] font-mono text-pink-300 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-pink-500/30 mt-[-6px]">
                    Quantum
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* DOCK CONTROLS: CHEER, SQUAD MODE & TEMPO */}
          <div className="mt-3.5 space-y-2.5">
            {/* Action Row */}
            <div className="flex items-center gap-2">
              {/* Cheer Button */}
              <button
                onClick={handleCheer}
                type="button"
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                <span>Cheer Pandas</span>
                {cheerCount > 0 && (
                  <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md">
                    +{cheerCount}
                  </span>
                )}
              </button>

              {/* Toggle Solo vs Squad */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <button
                  onClick={() => setSquadMode('solo')}
                  type="button"
                  className={`p-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                    squadMode === 'solo'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Solo Nova"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Solo</span>
                </button>
                <button
                  onClick={() => setSquadMode('squad')}
                  type="button"
                  className={`p-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                    squadMode === 'squad'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Panda Squad"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Squad (3)</span>
                </button>
              </div>
            </div>

            {/* Tempo Selector Row */}
            <div className="flex items-center justify-between gap-1 text-[11px] font-mono p-1 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <button
                onClick={() => setDanceTempo('groove')}
                type="button"
                className={`flex-1 py-1 px-2 rounded-lg transition cursor-pointer text-center ${
                  danceTempo === 'groove'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Groove
              </button>
              <button
                onClick={() => setDanceTempo('hype')}
                type="button"
                className={`flex-1 py-1 px-2 rounded-lg transition cursor-pointer text-center ${
                  danceTempo === 'hype'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hype ⚡
              </button>
              <button
                onClick={() => setDanceTempo('breakdance')}
                type="button"
                className={`flex-1 py-1 px-2 rounded-lg transition cursor-pointer text-center ${
                  danceTempo === 'breakdance'
                    ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Breakdance 🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
