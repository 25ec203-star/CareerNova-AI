import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Target,
  Code2,
  Brain,
  Video,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const isCompletelyEmpty =
    state.codingProblemsSolved === 0 &&
    state.aptitudeScore === 0 &&
    state.interviewSessionsCount === 0 &&
    !state.resumeAnalysis &&
    !state.skillAssessment;

  const badges = [
    {
      id: 'b1',
      title: 'First Quantum Step',
      desc: 'Complete your 3D profile setup',
      unlocked: state.activeNodes.profile,
    },
    {
      id: 'b2',
      title: 'Algorithm Practitioner',
      desc: 'Solve your first problem in Coding Arena',
      unlocked: state.codingProblemsSolved >= 1,
    },
    {
      id: 'b3',
      title: 'ATS Verified',
      desc: 'Upload and parse an authentic resume document',
      unlocked: state.resumeStatus === 'Analyzed',
    },
    {
      id: 'b4',
      title: 'Cognitive Benchmarked',
      desc: 'Complete an aptitude arena challenge',
      unlocked: !!state.aptitudeResult,
    },
    {
      id: 'b5',
      title: 'Interview Ready',
      desc: 'Complete a 3D mock interview round',
      unlocked: state.interviewSessionsCount >= 1,
    },
    {
      id: 'b6',
      title: 'Placement Contender',
      desc: 'Attain >50% overall Career Readiness',
      unlocked: state.careerReadiness >= 50,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider font-mono">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Telemetry & Telemetric Performance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Career Analytics & Gamification
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Strictly driven by genuine verified platform actions. No synthetic charts or inflated statistics.
          </p>
        </div>

        {/* Gamification Level Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{state.level}</span>
            <span className="text-[10px] text-cyan-400 font-mono tabular-nums">{state.xp} XP Accumulated</span>
          </div>
        </div>
      </div>

      {/* Gamification Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <span className="text-xs text-slate-400">Experience Points (XP)</span>
          <div className="text-2xl lg:text-3xl font-black text-cyan-400 font-mono tabular-nums">
            {state.xp}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Earned from real milestones</span>
        </div>

        <div>
          <span className="text-xs text-slate-400">Current Level</span>
          <div className="text-xl lg:text-2xl font-black text-purple-400 font-mono truncate">
            {state.level}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Dynamic milestone rank</span>
        </div>

        <div>
          <span className="text-xs text-slate-400">Active Streak</span>
          <div className="text-2xl lg:text-3xl font-black text-amber-400 font-mono tabular-nums flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-500" />
            {state.streakDays} days
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Daily engagement</span>
        </div>

        <div>
          <span className="text-xs text-slate-400">Achievements Unlocked</span>
          <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono tabular-nums">
            {badges.filter((b) => b.unlocked).length} / {badges.length}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Verified achievements</span>
        </div>
      </div>

      {/* 24. INITIAL STATE: NO DATA ELEVATION */}
      {isCompletelyEmpty ? (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Complete activities to generate analytics.
          </h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Analytics remain zero until you begin solving coding problems, benchmark aptitude, or upload your resume. We never populate mock charts.
          </p>

          <button
            onClick={() => setCurrentTab('coding-arena')}
            type="button"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
          >
            Start First Activity
          </button>
        </div>
      ) : (
        /* DYNAMIC POPULATED CHARTS & METRICS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart 1: Placement & Career Readiness Progress */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold text-white uppercase font-mono">Readiness Vector</span>
                <Target className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Career Readiness</span>
                    <span className="font-mono text-cyan-400 font-bold">{state.careerReadiness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-700"
                      style={{ width: `${state.careerReadiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Placement Readiness</span>
                    <span className="font-mono text-purple-400 font-bold">{state.placementReadiness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 transition-all duration-700"
                      style={{ width: `${state.placementReadiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Company Compatibility</span>
                    <span className="font-mono text-rose-400 font-bold">{state.companyMatchPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-400 transition-all duration-700"
                      style={{ width: `${state.companyMatchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800 mt-4">
              Weighted composite of all verified modules.
            </div>
          </div>

          {/* Chart 2: Coding Arena Performance */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold text-white uppercase font-mono">Coding Metrics</span>
                <Code2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">Solved</span>
                  <span className="text-xl font-bold text-white">{state.codingProblemsSolved}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">Submissions</span>
                  <span className="text-xl font-bold text-white">{state.codingSubmissions.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">Accuracy</span>
                  <span className="text-xl font-bold text-cyan-400">
                    {state.codingSubmissions.length > 0
                      ? `${Math.round(
                          (state.codingSubmissions.filter((s) => s.status === 'Accepted').length /
                            state.codingSubmissions.length) *
                            100
                        )}%`
                      : '0%'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">Pass Rate</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {Math.round((state.codingProblemsSolved / 3) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800 mt-4">
              Real evaluation outputs from in-browser execution sandbox.
            </div>
          </div>

          {/* Chart 3: Resume & Skill Strength */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold text-white uppercase font-mono">Resume & Aptitude</span>
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                  <span className="text-slate-300">Resume ATS Score</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {state.resumeAnalysis ? `${state.resumeAnalysis.atsScore}%` : 'Not uploaded'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                  <span className="text-slate-300">Aptitude Score</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {state.aptitudeResult ? `${state.aptitudeResult.overallScore}%` : 'Not tested'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                  <span className="text-slate-300">Interview Sessions</span>
                  <span className="font-mono text-rose-400 font-bold">
                    {state.interviewSessionsCount} rounds
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800 mt-4">
              Scores reflect verified parsed content and actual quiz submissions.
            </div>
          </div>
        </div>
      )}

      {/* 25. BADGES & ACHIEVEMENTS GRID */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Earned Achievements & Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-850 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.unlocked
                    ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                    : 'bg-slate-850 border border-slate-750 text-slate-500'
                }`}
              >
                {badge.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>

              <div>
                <span className="text-xs font-bold text-white block mb-0.5">{badge.title}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{badge.desc}</p>
                <span
                  className={`text-[10px] font-mono mt-2 inline-block ${
                    badge.unlocked ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {badge.unlocked ? 'Unlocked' : 'Locked · Action required'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
