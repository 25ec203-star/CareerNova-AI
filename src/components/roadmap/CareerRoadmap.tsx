import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Code2,
  FileText,
  Video,
  Building2,
  AlertCircle,
} from 'lucide-react';

export const CareerRoadmap: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const isUnlocked = state.activeNodes.roadmap;

  const stages = [
    {
      step: 1,
      title: 'Profile Assessment',
      desc: 'Define target role, academic credentials, and career identity.',
      completed: true,
      current: false,
      tab: 'profile' as const,
    },
    {
      step: 2,
      title: 'Skill Gap Analysis',
      desc: 'Benchmark engineering fundamentals against corporate standards.',
      completed: state.skillAssessmentStatus === 'Completed',
      current: state.skillAssessmentStatus !== 'Completed',
      tab: 'skill-assessment' as const,
    },
    {
      step: 3,
      title: 'Learning Plan',
      desc: 'Master core Data Structures, Algorithms, and System Design patterns.',
      completed: state.codingProblemsSolved >= 2,
      current: state.skillAssessmentStatus === 'Completed' && state.codingProblemsSolved < 2,
      tab: 'coding-arena' as const,
    },
    {
      step: 4,
      title: 'Projects',
      desc: 'Engineer production-grade architectures with verified GitHub repositories.',
      completed: state.codingProblemsSolved >= 3 || (state.resumeAnalysis?.experienceLevel !== 'None' && !!state.resumeAnalysis),
      current: state.codingProblemsSolved >= 2 && state.codingProblemsSolved < 3,
      tab: 'profile' as const,
    },
    {
      step: 5,
      title: 'Resume Optimization',
      desc: 'Refine ATS keyword density and quantifiable engineering metrics.',
      completed: state.resumeStatus === 'Analyzed',
      current: state.resumeStatus !== 'Analyzed',
      tab: 'resume-ai' as const,
    },
    {
      step: 6,
      title: 'Mock Interviews',
      desc: 'Rigorous real-time evaluation with 3D Technical and HR interviewer panels.',
      completed: state.interviewSessionsCount >= 2,
      current: state.interviewSessionsCount < 2,
      tab: 'tech-interview' as const,
    },
    {
      step: 7,
      title: 'Company Preparation',
      desc: 'Company-specific question bank rehearsal for Tier-1 technology giants.',
      completed: state.companyMatchPercentage >= 75,
      current: state.companyMatchPercentage < 75 && state.activeNodes.companies,
      tab: 'companies' as const,
    },
    {
      step: 8,
      title: 'Placement Ready',
      desc: 'Final candidacy verification for top product placement offers.',
      completed: state.careerReadiness >= 80,
      current: false,
      tab: 'dashboard' as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider font-mono">
            <Compass className="w-4 h-4 text-purple-400" />
            Adaptive Milestone Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Career Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A dynamic 8-stage placement preparation curriculum that synchronizes with your actual performance benchmarks.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
          Status: {isUnlocked ? 'Roadmap Synthesized' : 'Roadmap Locked'}
        </div>
      </div>

      {/* 22. INITIAL STATE: NOT READY YET */}
      {!isUnlocked && (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your personalized roadmap is not ready yet.
          </h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Complete your profile and assessments to generate your roadmap. We formulate milestones strictly from your authentic strengths and measured gaps.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setCurrentTab('skill-assessment')}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Award className="w-4 h-4" />
              Complete Skill Assessment
            </button>

            <button
              onClick={() => setCurrentTab('coding-arena')}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              Solve Coding Challenge
            </button>

            <button
              onClick={() => setCurrentTab('resume-ai')}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Upload Resume
            </button>
          </div>
        </div>
      )}

      {/* UNLOCKED ADAPTIVE ROADMAP */}
      {isUnlocked && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Adaptive Progression Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Role: {state.user.targetRole} · Milestones recalculate upon each submission
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              {stages.filter((s) => s.completed).length} of {stages.length} Milestones Achieved
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6 ml-4">
            {stages.map((stage) => (
              <div key={stage.step} className="relative group">
                {/* Node Dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    stage.completed
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : stage.current
                      ? 'bg-cyan-500 text-black ring-4 ring-cyan-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {stage.completed ? <CheckCircle2 className="w-4 h-4" /> : stage.step}
                </div>

                {/* Stage Card */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    stage.completed
                      ? 'bg-slate-900/70 border-emerald-500/30'
                      : stage.current
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl'
                      : 'bg-slate-950/40 border-slate-850 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{stage.title}</span>
                        {stage.completed && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                            Completed
                          </span>
                        )}
                        {stage.current && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono animate-pulse">
                            Active Next Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{stage.desc}</p>
                    </div>

                    <button
                      onClick={() => setCurrentTab(stage.tab)}
                      type="button"
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{stage.completed ? 'Review' : 'Open Module'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
