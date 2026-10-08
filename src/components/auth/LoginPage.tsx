import React, { useState } from 'react';
import { AbstractGeometricScene } from '../3d/AbstractGeometricScene';
import { DancingPanda } from '../3d/DancingPanda';
import { useApp } from '../../context/AppContext';
import { verifyCredentials, registerNewAccount } from '../../utils/accountRegistry';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Brain,
  AlertCircle,
  Code2,
  Compass,
  Layers,
  Terminal,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack AI Engineer');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Transition stage: 'idle' | 'particles' | 'logo' | 'neural' | 'complete'
  const [transitionStage, setTransitionStage] = useState<
    'idle' | 'particles' | 'logo' | 'neural' | 'complete'
  >('idle');

  const executeSuccessSequence = (userName: string, userEmail: string, userRole?: string) => {
    setTransitionStage('particles');

    setTimeout(() => {
      setTransitionStage('logo');
    }, 800);

    setTimeout(() => {
      setTransitionStage('neural');
    }, 1700);

    setTimeout(() => {
      setTransitionStage('complete');
      login({
        name: userName,
        email: userEmail,
        targetRole: userRole || targetRole || 'Full Stack AI Engineer',
      });
    }, 2600);
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (mode === 'signup') {
      const regRes = registerNewAccount({
        name,
        email,
        password,
        targetRole,
      });

      if (!regRes.success || !regRes.account) {
        setAuthError(regRes.error || 'Registration failed. Please check your inputs.');
        return;
      }

      setAuthSuccess(`Account created for ${regRes.account.name}! Authenticating...`);
      executeSuccessSequence(regRes.account.name, regRes.account.email, regRes.account.targetRole);
    } else {
      // Sign In mode
      const authRes = verifyCredentials(email, password);

      if (!authRes.success || !authRes.account) {
        setAuthError(authRes.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      setAuthSuccess(`Welcome back, ${authRes.account.name}! Initializing OS...`);
      executeSuccessSequence(authRes.account.name, authRes.account.email, authRes.account.targetRole);
    }
  };

  const handleDemoLogin = () => {
    setEmail('candidate@careernova.ai');
    setPassword('demo123');
    setName('Alex Chen');
    setAuthError(null);
    setAuthSuccess('Demo credentials verified.');
    executeSuccessSequence('Alex Chen', 'candidate@careernova.ai', 'Full Stack AI Engineer');
  };

  const handleFillAccount = (demoEmail: string, demoPass: string, demoName?: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    if (demoName) setName(demoName);
    setAuthError(null);
  };

  const handleGoogleLogin = () => {
    executeSuccessSequence('Alex Chen (Google SSO)', 'alex.chen@gmail.com', targetRole);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060814] text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3D ABSTRACT GEOMETRIC ENVIRONMENT BACKGROUND */}
      <AbstractGeometricScene />

      {/* Atmospheric High-End Glassmorphism Background Glow Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-purple-600/15 via-pink-600/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-indigo-600/10 to-transparent rounded-full blur-[130px]" />

        {/* Diagonal Subtle Cyber Beams */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent transform -rotate-12 pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/15 to-transparent transform -rotate-12 pointer-events-none" />

        {/* Ambient Geometric Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px), radial-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            backgroundPosition: '0 0, 22px 22px',
          }}
        />
      </div>

      {/* TOP HEADER BAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">CareerNova AI</span>
            <span className="hidden sm:inline-block ml-3 text-xs text-slate-400 font-mono border-l border-slate-700/80 pl-3">
              Adaptive Career Intelligence Platform
            </span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer backdrop-blur-md"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Quick Demo Access
        </button>
      </header>

      {/* MAIN VIEWPORT: HIGH-END DUAL-COLUMN GLASSMORPHISM INTERFACE */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* Left Column: Abstract Professional AI Environment with Dancing Panda Companion */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center lg:items-start space-y-4">
          {/* Hero Kicker & Headlines */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-xl w-fit shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Autonomous Placement Intelligence OS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Empowering Next-Gen Careers Through{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Adaptive AI Intelligence
              </span>
            </h1>
          </div>

          {/* Main 3D Dancing Panda Showcase - Authentic Cutout Old Panda */}
          <div className="w-full relative flex items-center justify-center">
            <DancingPanda isWavingSuccess={transitionStage !== 'idle'} />
          </div>

          {/* Refined Glassmorphism Telemetry Pills */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 flex items-center gap-2.5 shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold text-white uppercase font-mono block">
                  3D Intelligence Core
                </span>
                <span className="text-[10px] text-slate-400">10 Reactive Nodes</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 flex items-center gap-2.5 shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold text-white uppercase font-mono block">
                  Zero-Bias Baseline
                </span>
                <span className="text-[10px] text-slate-400">0% Initial Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Glassmorphism Login Card */}
        <div className="w-full lg:w-5/12 max-w-md">
          <div className="relative rounded-3xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:border-cyan-500/30 transition-all duration-300">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  v2.6 OS
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Your AI-powered career journey starts here.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            {/* Error & Success Feedback Banners */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Authentication Error</span>
                  <span className="text-[11px] text-rose-300/90">{authError}</span>
                </div>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Verified</span>
                  <span className="text-[11px] text-emerald-300/90">{authSuccess}</span>
                </div>
              </div>
            )}

            {/* Quick-fill helper for test accounts */}
            {mode === 'login' && (
              <div className="mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-1">
                  Verified Accounts Ready to Test:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillAccount('candidate@careernova.ai', 'demo123', 'Alex Chen')}
                    className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] transition cursor-pointer"
                  >
                    candidate@careernova.ai (demo123)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillAccount('25ec203@kpriet.ac.in', 'kpriet2026', 'Dev Candidate')}
                    className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] transition cursor-pointer"
                  >
                    25ec203@kpriet.ac.in (kpriet2026)
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@careernova.ai"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Placement Role
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Full Stack AI Engineer">Full Stack AI Engineer</option>
                    <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
                    <option value="Embedded Systems & IoT Engineer">Embedded Systems & IoT Engineer</option>
                    <option value="Data Scientist & ML Engineer">Data Scientist & ML Engineer</option>
                    <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={transitionStage !== 'idle'}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white hover:opacity-95 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{mode === 'login' ? 'Authenticate & Enter' : 'Initialize Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Continue with Google SSO */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email address to receive password recovery instructions.
            </p>
            {forgotSent ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Password reset link dispatched to {forgotEmail}.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 cursor-pointer"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-800/80">
        <div>© 2026 CareerNova AI · Adaptive Career Intelligence OS</div>
        <div className="flex items-center gap-4">
          <span>Placement Season Ready</span>
          <span aria-hidden="true">·</span>
          <span>Zero-State Adaptive Engine</span>
        </div>
      </footer>

      {/* CINEMATIC AI TRANSITION OVERLAY */}
      {transitionStage !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-[#060814]/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-700">
          <div className="relative flex flex-col items-center max-w-md text-center p-8">
            {transitionStage === 'particles' && (
              <div className="relative animate-pulse">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/80 animate-spin flex items-center justify-center mx-auto mb-4" />
                <h2 className="text-xl font-bold text-cyan-300">Synchronizing Spatial Intelligence...</h2>
                <p className="text-xs text-slate-400 mt-2 font-mono">Converging quantum nodes</p>
              </div>
            )}

            {transitionStage === 'logo' && (
              <div className="animate-scale-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-[0_0_50px_rgba(6,182,212,0.6)] animate-pulse">
                  <Sparkles className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">CareerNova AI</h2>
                <p className="text-xs text-cyan-400 mt-1 font-mono">Neural Interface Initialized</p>
              </div>
            )}

            {transitionStage === 'neural' && (
              <div>
                <div className="relative w-28 h-28 mx-auto mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-purple-500/60 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-cyan-400/80 animate-spin" />
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_35px_#00f0ff] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-black" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">Career Intelligence Core Online</h2>
                <p className="text-xs text-slate-300 mt-1">Calibrating zero-state metrics...</p>
              </div>
            )}

            {transitionStage === 'complete' && (
              <div className="opacity-0 transition-opacity duration-500">
                <h2 className="text-2xl font-bold text-white">Launching Dashboard...</h2>
              </div>
            )}

            {/* Progress Bar */}
            <div className="w-56 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ease-out"
                style={{
                  width:
                    transitionStage === 'particles'
                      ? '35%'
                      : transitionStage === 'logo'
                      ? '70%'
                      : '100%',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
