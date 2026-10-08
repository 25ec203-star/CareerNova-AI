import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CareerIntelligenceCore } from '../3d/CareerIntelligenceCore';
import { AvatarViewer } from '../3d/AvatarViewer';
import pandaTransparentPng from '../../assets/images/panda_transparent.png';
import confetti from 'canvas-confetti';
import {
  Code2,
  Brain,
  FileText,
  Award,
  Video,
  Building2,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Heart,
  Users,
  User,
  Music,
  Flame,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const [dashboardPandaMode, setDashboardPandaMode] = useState<'solo' | 'squad'>('squad');
  const [dashboardPandaTempo, setDashboardPandaTempo] = useState<'groove' | 'hype' | 'breakdance'>('hype');
  const [dashboardDanceStep, setDashboardDanceStep] = useState(0);
  const [dashboardCheerCount, setDashboardCheerCount] = useState(0);

  // Dance ticker
  useEffect(() => {
    const speed = dashboardPandaTempo === 'breakdance' ? 190 : dashboardPandaTempo === 'hype' ? 260 : 420;
    const interval = setInterval(() => {
      setDashboardDanceStep((s) => (s + 1) % 4);
    }, speed);
    return () => clearInterval(interval);
  }, [dashboardPandaTempo]);

  const handleDashboardCheer = () => {
    setDashboardCheerCount((c) => c + 1);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#d946ef', '#38bdf8', '#ffffff', '#ec4899'],
    });
  };

  const isCompletelyZeroState =
    state.codingProblemsSolved === 0 &&
    state.aptitudeScore === 0 &&
    state.interviewSessionsCount === 0 &&
    state.resumeStatus !== 'Analyzed' &&
    state.skillAssessmentStatus !== 'Completed';

  // Bounce and tilt calculations
  const bounceY =
    dashboardPandaTempo === 'breakdance'
      ? Math.sin(dashboardDanceStep * Math.PI) * -18
      : dashboardPandaTempo === 'hype'
      ? Math.sin(dashboardDanceStep * Math.PI) * -12
      : Math.sin(dashboardDanceStep * Math.PI) * -7;

  const tiltDeg =
    dashboardPandaTempo === 'breakdance'
      ? (dashboardDanceStep % 2 === 0 ? 7 : -7)
      : dashboardPandaTempo === 'hype'
      ? (dashboardDanceStep % 2 === 0 ? 4 : -4)
      : (dashboardDanceStep % 2 === 0 ? 2 : -2);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 7. DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Placement Preparation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good to see you at CareerNova AI
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
            Your career journey starts here.
          </p>
        </div>

        {/* Right Header Status Cards */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {/* Nova Panda Mascot Pill */}
          <div
            onClick={handleDashboardCheer}
            title="Click to cheer Nova!"
            className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <img
                src={pandaTransparentPng}
                alt="Nova Panda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)] group-hover:scale-110 transition animate-bounce"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Nova Mascot</span>
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400/50" />
              </div>
              <div className="text-[10px] text-cyan-300 font-mono">
                {dashboardCheerCount > 0 ? `${dashboardCheerCount} Cheers!` : 'Vibing with you'}
              </div>
            </div>
          </div>

          {/* User Mini Avatar & Level Card */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-850">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/20 shrink-0">
              <AvatarViewer size="xs" interactive={false} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{state.user.name}</div>
              <div className="text-[11px] text-cyan-400 font-mono">{state.level}</div>
              <div className="text-[10px] text-slate-500 font-mono tabular-nums">{state.xp} XP Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. DASHBOARD 8 METRIC CARDS (ZERO INITIAL STATE COMPLIANT) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Career Readiness */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Career Readiness</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.careerReadiness}%
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${Math.max(2, state.careerReadiness)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {state.careerReadiness === 0 ? 'Starts at 0% · Zero initial bias' : 'Derived from verified activities'}
          </p>
        </div>

        {/* 2. Placement Readiness */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Placement Readiness</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.placementReadiness}%
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-500"
              style={{ width: `${Math.max(2, state.placementReadiness)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {state.placementReadiness === 0 ? 'No assessment benchmarks yet' : 'Weighted placement index'}
          </p>
        </div>

        {/* 3. Coding */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Coding</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.codingProblemsSolved} <span className="text-sm font-normal text-slate-400">solved</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Accuracy:</span>
            <span className="font-mono text-white">
              {state.codingSubmissions.length > 0
                ? `${Math.round(
                    (state.codingSubmissions.filter((s) => s.status === 'Accepted').length /
                      state.codingSubmissions.length) *
                      100
                  )}%`
                : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {state.codingProblemsSolved === 0 ? 'Empty editor · Awaiting solutions' : 'Verified test runs'}
          </p>
        </div>

        {/* 4. Aptitude */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Aptitude</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.aptitudeScore}%
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.max(2, state.aptitudeScore)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {state.aptitudeResult ? 'Calculated from actual quiz' : 'No assessment completed'}
          </p>
        </div>

        {/* 5. Interviews */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Interviews</span>
            <Video className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.interviewSessionsCount} <span className="text-sm font-normal text-slate-400">sessions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            {state.interviewSessionsCount === 0 ? '0 mock sessions completed' : '3D AI evaluations logged'}
          </p>
        </div>

        {/* 6. Resume */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Resume</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg lg:text-xl font-bold text-white font-mono">
            {state.resumeStatus === 'Analyzed' ? `${state.resumeAnalysis?.atsScore}% ATS` : 'Not analyzed'}
          </div>
          <p className="text-[11px] text-slate-500 mt-5">
            {state.resumeStatus === 'Analyzed'
              ? `${state.resumeAnalysis?.skillsExtracted.length} skills identified`
              : 'Upload real PDF/DOCX to parse'}
          </p>
        </div>

        {/* 7. Skills */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Skills</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg lg:text-xl font-bold text-white font-mono">
            {state.skillAssessmentStatus === 'Completed'
              ? `${state.skillAssessment?.overallScore}% verified`
              : 'Not assessed'}
          </div>
          <p className="text-[11px] text-slate-500 mt-5">
            {state.skillAssessmentStatus === 'Completed' ? 'Competency benchmarked' : 'Assessment pending'}
          </p>
        </div>

        {/* 8. Company Match */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Company Match</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">
            {state.companyMatchPercentage}%
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            {state.companyMatchPercentage === 0 ? 'Locked until profile & coding exist' : 'Calibrated to dream companies'}
          </p>
        </div>
      </div>

      {/* 8. DASHBOARD EMPTY STATE CALLOUT */}
      {isCompletelyZeroState && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-3 font-mono">
              <AlertCircle className="w-4 h-4" />
              AUTHENTIC ZERO-PROGRESS INITIAL STATE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your CareerNova journey starts here.
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Complete your first activity to start building your AI career profile. We never synthesize fake stats or fabricated accomplishments. All scores and 3D nodes unlock dynamically through genuine placement preparation.
            </p>

            {/* 5 Action Buttons required by user specification */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setCurrentTab('skill-assessment')}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Take Skill Assessment
              </button>

              <button
                onClick={() => setCurrentTab('coding-arena')}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition flex items-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                Start Coding
              </button>

              <button
                onClick={() => setCurrentTab('resume-ai')}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                Upload Resume
              </button>

              <button
                onClick={() => setCurrentTab('aptitude')}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Brain className="w-4 h-4 text-amber-400" />
                Start Aptitude Test
              </button>

              <button
                onClick={() => setCurrentTab('profile')}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                Build My Profile
              </button>
            </div>
          </div>

          {/* Dancing Panda Companion Preview - True Transparent PNG */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-36 h-48 sm:w-44 sm:h-56 flex items-center justify-center">
              {/* Floor Glow Ring */}
              <div className="absolute -bottom-2 w-32 h-8 rounded-full bg-cyan-500/30 blur-md pointer-events-none" />
              <img
                src={pandaTransparentPng}
                alt="Nova Panda Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_25px_rgba(0,240,255,0.4)] animate-bounce"
              />
              <div className="absolute bottom-0 text-center text-[10px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                Nova Cheering You!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. 3D CAREER INTELLIGENCE CORE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/90 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 z-10">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                3D Career Intelligence Core
              </h2>
              <p className="text-xs text-slate-400">
                Interactive spatial visualization. Orbital nodes ignite upon completing genuine career activities.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('career-core')}
              type="button"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              Full Visualizer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="w-full h-[400px] lg:h-[420px] rounded-2xl overflow-hidden bg-slate-950/60 border border-slate-850 relative">
            <CareerIntelligenceCore compact />
          </div>
        </div>

        {/* Right Info & Quick Action Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          {/* Active Nodes Summary */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/90 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Quantum Node Status
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {Object.values(state.activeNodes).filter(Boolean).length} / 10 Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(state.activeNodes).map(([key, active]) => (
                  <div
                    key={key}
                    className={`p-2 rounded-xl flex items-center justify-between border transition ${
                      active
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : 'bg-slate-950/40 border-slate-850 text-slate-500'
                    }`}
                  >
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {active ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Every completed module connects directly to your central AI neural core, shaping your adaptive career trajectory.
            </div>
          </div>

          {/* AI Mentor Quick Insight */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 border border-purple-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase font-mono">Career Strategist</h4>
                <div className="text-[10px] text-purple-300">Nova Intelligence</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {isCompletelyZeroState
                ? '"I am ready to help you build your career profile. Take a skill assessment or upload your resume so I can formulate targeted placement intelligence."'
                : `"Profile is growing! You have unlocked ${Object.values(state.activeNodes).filter(Boolean).length} core intelligence nodes. Continue practicing coding and mock interviews for Tier-1 readiness."`}
            </p>
            <button
              onClick={() => setCurrentTab('ai-mentor')}
              type="button"
              className="mt-4 w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Consult AI Mentor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 11. NOVA & ASTRA PANDA CHEER SQUAD ARENA */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/45 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Placement Companions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Nova & Astra Panda Cheer Squad</span>
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-normal">
                🐾 {dashboardPandaMode === 'squad' ? '3 Pandas Active' : 'Solo Nova'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized 3D cyber dance routines and adaptive placement motivation throughout your CareerNova journey.
            </p>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Solo vs Squad Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              <button
                onClick={() => setDashboardPandaMode('solo')}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  dashboardPandaMode === 'solo'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Solo Nova</span>
              </button>
              <button
                onClick={() => setDashboardPandaMode('squad')}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  dashboardPandaMode === 'squad'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Panda Squad (3)</span>
              </button>
            </div>

            {/* Tempo Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setDashboardPandaTempo('groove')}
                type="button"
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  dashboardPandaTempo === 'groove'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Groove
              </button>
              <button
                onClick={() => setDashboardPandaTempo('hype')}
                type="button"
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  dashboardPandaTempo === 'hype'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hype ⚡
              </button>
              <button
                onClick={() => setDashboardPandaTempo('breakdance')}
                type="button"
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  dashboardPandaTempo === 'breakdance'
                    ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Breakdance 🔥
              </button>
            </div>

            {/* Cheer Button */}
            <button
              onClick={handleDashboardCheer}
              type="button"
              className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span>Cheer Squad</span>
              {dashboardCheerCount > 0 && (
                <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md">
                  +{dashboardCheerCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Panda Stage & Placement Coaching Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left/Center Stage: Interactive Dancing Pandas */}
          <div className="lg:col-span-8 relative h-[260px] sm:h-[300px] rounded-2xl bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Stage Floor Glow Ring */}
            <div className="absolute bottom-4 w-72 sm:w-96 h-16 rounded-full bg-gradient-to-r from-cyan-500/25 via-purple-500/20 to-pink-500/25 blur-lg pointer-events-none" />

            {/* Holographic Cyber Stage Grid Beams */}
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent pointer-events-none" />

            {/* Stage Floor Rings */}
            <div className="absolute bottom-2 w-64 h-10 border border-cyan-500/20 rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 w-80 h-12 border border-purple-500/15 rounded-full pointer-events-none" />

            {/* Pandas Viewport */}
            {dashboardPandaMode === 'solo' ? (
              /* Solo Nova */
              <div
                onClick={handleDashboardCheer}
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
                  className="w-40 sm:w-48 h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(0,240,255,0.45)] hover:scale-105 transition"
                />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs mt-[-10px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <span>Nova</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[10px] text-slate-300">Lead Cheer Master</span>
                </div>
              </div>
            ) : (
              /* Triple Panda Squad */
              <div className="relative z-10 w-full flex items-end justify-center gap-3 sm:gap-6 px-4">
                {/* 1. Astra (Left) */}
                <div
                  onClick={handleDashboardCheer}
                  title="Astra the Violet Cheer Panda"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center opacity-90"
                  style={{
                    transform: `translateY(${
                      dashboardPandaTempo === 'breakdance'
                        ? Math.sin((dashboardDanceStep + 1) * Math.PI) * -16
                        : Math.sin((dashboardDanceStep + 1) * Math.PI) * -10
                    }px) rotate(${-tiltDeg * 0.9}deg) scale(0.9)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Astra Panda"
                    referrerPolicy="no-referrer"
                    className="w-32 sm:w-36 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(168,85,247,0.45)] hue-rotate-[260deg]"
                  />
                  <div className="px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-purple-500/40 text-purple-300 font-mono text-[10px] mt-[-8px]">
                    Astra 💜
                  </div>
                </div>

                {/* 2. Nova (Center) */}
                <div
                  onClick={handleDashboardCheer}
                  title="Nova - Squad Leader"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center z-20"
                  style={{
                    transform: `translateY(${bounceY}px) rotate(${tiltDeg}deg) scale(1.1)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Nova Panda"
                    referrerPolicy="no-referrer"
                    className="w-40 sm:w-48 h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(0,240,255,0.5)]"
                  />
                  <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-xs mt-[-10px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    Nova ✨
                  </div>
                </div>

                {/* 3. Quantum (Right) */}
                <div
                  onClick={handleDashboardCheer}
                  title="Quantum the Cyber Cheer Panda"
                  className="cursor-pointer transition-transform duration-200 ease-out flex flex-col items-center opacity-90"
                  style={{
                    transform: `translateY(${
                      dashboardPandaTempo === 'breakdance'
                        ? Math.sin((dashboardDanceStep + 2) * Math.PI) * -16
                        : Math.sin((dashboardDanceStep + 2) * Math.PI) * -10
                    }px) rotate(${tiltDeg * 0.9}deg) scale(0.9)`,
                  }}
                >
                  <img
                    src={pandaTransparentPng}
                    alt="Quantum Panda"
                    referrerPolicy="no-referrer"
                    className="w-32 sm:w-36 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(236,72,153,0.45)] hue-rotate-[320deg]"
                  />
                  <div className="px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-pink-500/40 text-pink-300 font-mono text-[10px] mt-[-8px]">
                    Quantum 💖
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Squad Placement Directives */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
            {/* Nova's Core Advice */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-lg">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-cyan-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nova's Placement Strategy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isCompletelyZeroState
                  ? "Every master engineer starts at zero! Complete your first test or coding problem to ignite the orbital neural nodes."
                  : `You have completed activities with ${state.codingProblemsSolved} coding solutions and ${state.aptitudeScore}% aptitude! Continue momentum for Tier-1 placements.`}
              </p>
            </div>

            {/* Astra's Aptitude Tip */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 shadow-lg">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-purple-300 font-mono">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Astra's Speed Metric</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Quantitative & logical reasoning is the primary recruitment filter. Regular mock tests build split-second problem pattern recognition."
              </p>
            </div>

            {/* Quick Action Trigger */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setCurrentTab('coding-arena')}
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Solve Coding</span>
              </button>
              <button
                onClick={() => setCurrentTab('skill-assessment')}
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Skill Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
