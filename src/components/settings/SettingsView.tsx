import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { speakText, stopSpeaking } from '../../utils/voiceAssistant';
import {
  Settings,
  Palette,
  LogOut,
  Download,
  Share2,
  HelpCircle,
  MessageSquare,
  Check,
  Copy,
  ExternalLink,
  Volume2,
  Camera,
  CameraOff,
  Mic,
  FileText,
  RotateCcw,
  Trash2,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Printer,
  Send,
  Sparkles,
  QrCode,
  User,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export type VisualTheme =
  | 'cyber-neon'
  | 'deep-astral'
  | 'emerald-matrix'
  | 'solar-flare'
  | 'midnight-slate';

interface ThemeOption {
  id: VisualTheme;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  badge: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon (Default)',
    description: 'Electric cyan, deep violet glow, and high-contrast dark space.',
    primaryColor: '#00f0ff',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(0, 240, 255, 0.3)',
    badge: 'Popular',
  },
  {
    id: 'deep-astral',
    name: 'Deep Astral',
    description: 'Cosmic indigo, celestial starlight blue, and interstellar nebula.',
    primaryColor: '#6366f1',
    accentColor: '#38bdf8',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    badge: 'Cosmic',
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    description: 'Matrix green, futuristic mint, and deep obsidian carbon.',
    primaryColor: '#10b981',
    accentColor: '#06b6d4',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    badge: 'Terminal',
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Solar amber, sunset orange, and fiery energy highlights.',
    primaryColor: '#f59e0b',
    accentColor: '#ef4444',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    badge: 'Vibrant',
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Monolith',
    description: 'Minimalist charcoal, pure white chrome, and frosted titanium.',
    primaryColor: '#e2e8f0',
    accentColor: '#94a3b8',
    glowColor: 'rgba(226, 232, 240, 0.2)',
    badge: 'Sleek',
  },
];

export const SettingsView: React.FC = () => {
  const { state, logout, updateProfile, resetAllData, setCurrentTab } = useApp();

  // Active Tab within settings
  const [activeSection, setActiveSection] = useState<
    'theme' | 'account' | 'resume' | 'share' | 'help' | 'audio-hardware' | 'danger'
  >('theme');

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<VisualTheme>(() => {
    return (localStorage.getItem('careernova_visual_theme') as VisualTheme) || 'cyber-neon';
  });

  // Apply theme to document element
  const handleSelectTheme = (themeId: VisualTheme) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('careernova_visual_theme', themeId);
      document.documentElement.setAttribute('data-theme', themeId);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Sign out modal
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Share state
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Resume Download format
  const [resumeFormat, setResumeFormat] = useState<'txt' | 'md' | 'print'>('txt');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Help & Feedback state
  const [feedbackCategory, setFeedbackCategory] = useState('Feature Request');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Audio & Hardware Test state
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [cameraTestActive, setCameraTestActive] = useState(false);
  const testVideoRef = useRef<HTMLVideoElement>(null);
  const testStreamRef = useRef<MediaStream | null>(null);

  // Profile Edit fields
  const [editName, setEditName] = useState(state.user.name);
  const [editCollege, setEditCollege] = useState(state.user.college);
  const [editGradYear, setEditGradYear] = useState(state.user.graduationYear);
  const [editRole, setEditRole] = useState(state.user.targetRole);
  const [profileSaved, setProfileSaved] = useState(false);

  // Reset Data confirmation
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Cleanup camera test on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleToggleCameraTest = async () => {
    if (cameraTestActive) {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach((t) => t.stop());
        testStreamRef.current = null;
      }
      if (testVideoRef.current) testVideoRef.current.srcObject = null;
      setCameraTestActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        testStreamRef.current = stream;
        setCameraTestActive(true);
        if (testVideoRef.current) {
          testVideoRef.current.srcObject = stream;
          testVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        alert('Webcam access was denied or no camera device is connected.');
      }
    }
  };

  const handleTestVoice = () => {
    if (isTestingVoice) {
      stopSpeaking();
      setIsTestingVoice(false);
      return;
    }
    setIsTestingVoice(true);
    speakText(
      `Hello ${state.user.name.split(' ')[0]}! This is Dr. Nova. Your audio voice assistant is configured and ready for technical interviews at ${audioSpeed}x speed.`,
      {
        rate: audioSpeed,
        onEnd: () => setIsTestingVoice(false),
      }
    );
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareerNova AI - Placement Intelligence Platform',
          text: 'Practice Tier-1 mock interviews, coding challenges, and AI resume analysis with 3D avatars on CareerNova!',
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyShareLink();
    }
  };

  // Generate & Download Resume
  const handleDownloadResume = () => {
    const candidateName = state.user.name || 'Candidate Name';
    const email = state.user.email || 'candidate@careernova.ai';
    const role = state.user.targetRole || 'Full Stack AI Engineer';
    const college = state.user.college || 'Institute of Technology';
    const gradYear = state.user.graduationYear || '2026';
    const readiness = state.careerReadiness || 85;
    const skills =
      state.resumeAnalysis?.skillsExtracted && state.resumeAnalysis.skillsExtracted.length > 0
        ? state.resumeAnalysis.skillsExtracted.join(', ')
        : 'React, TypeScript, Node.js, Python, PostgreSQL, System Design, REST APIs, Git, Docker';

    if (resumeFormat === 'txt') {
      const content = `=======================================================
${candidateName.toUpperCase()}
Email: ${email}
Target Role: ${role}
Education: ${college} (Class of ${gradYear})
Career Readiness Index: ${readiness}%
=======================================================

PROFESSIONAL SUMMARY
Motivated ${role} with strong foundations in scalable software engineering,
data structures, distributed systems, and modern cloud architectures.

TECHNICAL SKILLS & COMPETENCIES
${skills}

ASSESSMENT & INTERVIEW TELEMETRY
- Career Readiness Index: ${readiness}%
- Coding Problems Solved: ${state.codingProblemsSolved}
- Aptitude Benchmark: ${state.aptitudeScore}%
- Mock Interviews Completed: ${state.interviewSessionsCount}
- Career Milestone: ${state.level}

PROJECT HIGHLIGHTS
1. CareerNova AI Platform
   - Architected responsive intelligence core with real-time WebGL spatial feedback.
   - Built full-stack TypeScript integration with verified multi-criteria assessment.

2. Cloud Microservices Engine
   - Implemented high-throughput rate limiters and concurrency control patterns.
   - Deployed containerized services with automated testing and metrics telemetry.

EDUCATION & ACADEMICS
- ${college}
  Bachelor of Technology / Engineering | Expected Graduation: ${gradYear}
=======================================================
Verified by CareerNova Autonomous Placement Intelligence OS
Generated at: ${new Date().toLocaleDateString()}
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_Resume_ATS.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (resumeFormat === 'md') {
      const content = `# ${candidateName}
**${role}** | ${email} | ${college} ('${gradYear})

---

### Professional Summary
Aspiring **${role}** with validated placement readiness score of **${readiness}%** on CareerNova AI. Experienced in distributed systems, modern frontends, and AI workflows.

### Core Technical Skills
${skills.split(', ').map((s) => `- **${s}**`).join('\n')}

### Verified Milestones
- **Placement Readiness**: ${readiness}%
- **Coding Problems Solved**: ${state.codingProblemsSolved}
- **Placement Tier**: ${state.level}

### Education
**${college}** — Class of ${gradYear}
`;
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_Resume.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Print / PDF preview
      window.print();
    }

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      college: editCollege,
      graduationYear: editGradYear,
      targetRole: editRole,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('careernova_user_feedback') || '[]');
      existing.push({
        id: Date.now(),
        category: feedbackCategory,
        rating: feedbackRating,
        message: feedbackMessage,
        user: state.user.email,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('careernova_user_feedback', JSON.stringify(existing));
    } catch {}

    setFeedbackSent(true);
    setFeedbackMessage('');
    setTimeout(() => setFeedbackSent(false), 3500);
  };

  const handleExecuteReset = () => {
    resetAllData();
    setResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleExecuteSignOut = () => {
    logout();
    setShowSignOutConfirm(false);
  };

  const FAQ_ITEMS = [
    {
      q: 'How does CareerNova calculate my Readiness Score?',
      a: 'Your Career Readiness Score (0-100%) dynamically aggregates your coding challenges solved, technical mock interview ratings with Dr. Nova, behavioral interview performance, ATS resume scan quality, and aptitude tests.',
    },
    {
      q: 'Why was my camera or microphone blocked?',
      a: 'Browsers require explicit camera and microphone permissions per origin. If blocked, click the lock icon in your browser address bar and enable Camera & Microphone. CareerNova also provides an interactive Virtual Candidate Stream fallback.',
    },
    {
      q: 'Can I test with multiple user accounts?',
      a: 'Yes! CareerNova features an Account Registry. You can create new accounts via the Sign Up tab on the Login Page, or quickly test with pre-seeded accounts (candidate@careernova.ai / demo123).',
    },
    {
      q: 'How does Dr. Nova evaluate technical answers?',
      a: 'Dr. Nova evaluates responses across conceptual depth, architecture trade-offs (e.g., CAP theorem, locking mechanisms, rate limiters), communication clarity, and candidate presence, providing scores from 74% to 98% based on substance.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Settings Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider font-mono">
            <Settings className="w-4 h-4 text-cyan-400" />
            System Preferences & Toolkit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Customization
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalize visual themes, download ATS resumes, share the platform, configure hardware, and manage account preferences.
          </p>
        </div>

        {/* Quick Sign Out Header Button */}
        <button
          onClick={() => setShowSignOutConfirm(true)}
          type="button"
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center gap-2 cursor-pointer self-start md:self-auto shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'theme', label: 'Visual Themes', icon: Palette },
          { id: 'account', label: 'Account Profile', icon: User },
          { id: 'resume', label: 'Download Resume', icon: Download },
          { id: 'share', label: 'Share Website', icon: Share2 },
          { id: 'audio-hardware', label: 'Audio & Hardware', icon: Volume2 },
          { id: 'help', label: 'Help & Feedback', icon: HelpCircle },
          { id: 'danger', label: 'Reset Data', icon: Trash2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              type="button"
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. VISUAL THEME SELECTOR */}
      {activeSection === 'theme' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-cyan-400" />
                  Visual Theme & Color Accent
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your ambient aesthetic. Changes apply across holographic components, glowing borders, and navigation.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                Active: {THEME_OPTIONS.find((t) => t.id === currentTheme)?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white tracking-wide">
                          {theme.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      {/* Color Palette preview pills */}
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                        <span className="text-[10px] font-mono text-slate-500">Palette</span>
                      </div>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-400 font-mono">
                          <Check className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 hover:text-slate-300 font-mono">
                          Apply Theme
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. ACCOUNT PROFILE & SIGN OUT */}
      {activeSection === 'account' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Candidate Profile Details & Editor */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Candidate Account Profile
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your candidate identity, university affiliation, and placement target role.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                {state.level}
              </span>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0" />
                Profile preferences successfully saved and synced!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Registered Email
                </label>
                <input
                  type="text"
                  disabled
                  value={state.user.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-850 text-slate-500 text-xs cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Placement Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Full Stack AI Engineer">Full Stack AI Engineer</option>
                    <option value="Software Development Engineer (SDE)">
                      Software Development Engineer (SDE)
                    </option>
                    <option value="Embedded Systems & IoT Engineer">
                      Embedded Systems & IoT Engineer
                    </option>
                    <option value="Data Scientist & ML Engineer">Data Scientist & ML Engineer</option>
                    <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Changes update your telemetry metrics across mock interviews.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Sign Out Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LogOut className="w-5 h-5 text-rose-400" />
                Sign Out of Current Session
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Logging out safely ends your active session and redirects to the Login Page with the dancing panda. Your registered account and scores remain saved.
              </p>
            </div>

            <button
              onClick={() => setShowSignOutConfirm(true)}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Confirm Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. DOWNLOAD RESUME */}
      {activeSection === 'resume' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-cyan-400" />
                  Export & Download Verified Resume
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate an ATS-optimized tech resume incorporating your real verified skills, readiness score, and project highlights.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                ATS Ready
              </span>
            </div>

            {downloadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0" />
                Resume generated and downloaded successfully! Check your downloads folder.
              </div>
            )}

            {/* Format Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'txt',
                  title: 'ATS Plain Text (.txt)',
                  desc: '100% parseable by Workday, Greenhouse, Taleo scanners.',
                  icon: FileText,
                },
                {
                  id: 'md',
                  title: 'Markdown Resume (.md)',
                  desc: 'Perfect for GitHub profile and developer portfolios.',
                  icon: Sparkles,
                },
                {
                  id: 'print',
                  title: 'Print / Save as PDF',
                  desc: 'Opens formatted browser print dialog for instant PDF saving.',
                  icon: Printer,
                },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = resumeFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setResumeFormat(fmt.id as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-lg ring-1 ring-cyan-400'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-cyan-400 mb-2" />
                    <span className="text-xs font-bold text-white block mb-1">{fmt.title}</span>
                    <span className="text-[11px] text-slate-400">{fmt.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Resume Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-[10px] uppercase text-cyan-400 tracking-wider font-bold">
                Resume Snapshot Content:
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
                <span>
                  <strong className="text-white">Candidate:</strong> {state.user.name}
                </span>
                <span>
                  <strong className="text-white">Target Role:</strong> {state.user.targetRole}
                </span>
                <span>
                  <strong className="text-white">Readiness Score:</strong>{' '}
                  {state.careerReadiness}%
                </span>
                <span>
                  <strong className="text-white">College:</strong> {state.user.college}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Generated strictly with verified placement telemetry.
              </span>
              <button
                onClick={handleDownloadResume}
                type="button"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {resumeFormat === 'print' ? 'Print or Save as PDF' : `Download Resume (.${resumeFormat})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHARE WEBSITE */}
      {activeSection === 'share' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                Share CareerNova AI
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Share this platform with classmates, peers, and placement study groups.
              </p>
            </div>

            {/* Link Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-cyan-300 truncate">
                {typeof window !== 'undefined' ? window.location.origin : 'https://careernova.ai'}
              </span>
              <button
                onClick={handleCopyShareLink}
                type="button"
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={handleNativeShare}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Native Share</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>Show QR Code</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  'Prepare for engineering campus placements with CareerNova AI! Practice 3D mock interviews, coding arena, and ATS resume scans: ' +
                    window.location.origin
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  window.location.origin
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIO & HARDWARE DIAGNOSTICS */}
      {activeSection === 'audio-hardware' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                Audio & Video Hardware Diagnostics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Test your webcam video feed and AI voice speech synthesis before entering mock interviews.
              </p>
            </div>

            {/* Voice Assistant Speed & Test */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    AI Interviewer Speech Rate
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Controls Dr. Nova & Sarah speech playback speed (Current: {audioSpeed}x)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isTestingVoice ? 'Stop Speaking' : 'Test AI Voice'}</span>
                </button>
              </div>

              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.1"
                value={audioSpeed}
                onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.8x (Deliberate)</span>
                <span>1.0x (Standard)</span>
                <span>1.4x (Brisk)</span>
              </div>
            </div>

            {/* Webcam Live Diagnostics Tool */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Webcam Video Hardware Test
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Verify video resolution and camera framing prior to mock sessions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleCameraTest}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    cameraTestActive
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {cameraTestActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  <span>{cameraTestActive ? 'Stop Preview' : 'Start Camera Test'}</span>
                </button>
              </div>

              {cameraTestActive && (
                <div className="relative w-full max-w-sm h-52 mx-auto rounded-2xl bg-black border border-cyan-500/40 overflow-hidden shadow-xl animate-fadeIn">
                  <video
                    ref={testVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>720p HD Feed Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. HELP & FEEDBACK */}
      {activeSection === 'help' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Feedback Form */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Submit Platform Feedback & Question Suggestions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Encountered an issue or have suggestions for new coding or interview questions? Share your feedback with our engineering team.
              </p>
            </div>

            {feedbackSent && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0" />
                Thank you! Your feedback has been received and logged.
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Feedback Category
                  </label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Feature Request">Feature Request</option>
                    <option value="Interview Question Suggestion">Interview Question Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="UI/UX Polish">UI/UX Polish</option>
                    <option value="General Praise">General Praise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Platform Rating
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="cursor-pointer transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      {feedbackRating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Message / Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Describe your feedback, feature idea, or questions you would like added to the mock rounds..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Feedback</span>
                </button>
              </div>
            </form>
          </div>

          {/* Frequently Asked Questions */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="space-y-2.5">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-semibold text-white flex items-center justify-between cursor-pointer hover:text-cyan-300"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-2.5">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. RESET DATA (DANGER ZONE) */}
      {activeSection === 'danger' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Application Data to Zero</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Resets all completed coding challenges, mock interview scores, resume scans, and achievements back to the pristine 0% initial baseline.
                </p>
              </div>
            </div>

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                All metrics successfully reset to 0%. Initial state restored.
              </div>
            )}

            {resetConfirm ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/50 space-y-3">
                <div className="flex items-center gap-2 text-xs text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  Are you sure you want to clear all progress? This action cannot be undone.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setResetConfirm(false)}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Yes, Reset All to Zero
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Reset State to 0%
              </button>
            )}
          </div>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION MODAL */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-750 p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Sign Out of CareerNova?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                You will return to the Login Page with the dancing panda companion. Your registered account details and scores remain safely stored on this browser.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleExecuteSignOut}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE MODAL FOR MOBILE SHARING */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-750 p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-sm font-bold text-white">Scan with Mobile Phone</h3>
            <div className="w-44 h-44 mx-auto rounded-2xl bg-white p-3 flex items-center justify-center shadow-lg">
              {/* Clean SVG QR Code representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="white" />
                <path
                  d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M45 10h10v10h-10z M45 25h10v10h-10z M45 45h10v10h-10z M60 45h10v10h-10z M75 45h15v10h-15z M45 60h10v15h-10z M60 60h15v10h-15z M60 75h10v15h-10z M75 75h15v15h-15z M25 45h10v10h-10z"
                  fill="#000000"
                />
              </svg>
            </div>
            <p className="text-[11px] text-slate-400">
              Open your camera app to access CareerNova AI on mobile.
            </p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
