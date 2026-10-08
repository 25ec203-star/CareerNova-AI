import React from 'react';
import { useApp } from '../../context/AppContext';
import { CareerIntelligenceCore } from '../3d/CareerIntelligenceCore';
import { Sparkles, ArrowRight, CheckCircle2, Lock, Cpu } from 'lucide-react';
import { NavigationTab } from '../../types';

export const CareerCoreView: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const nodeList: {
    id: string;
    label: string;
    tab: NavigationTab;
    description: string;
    requirement: string;
  }[] = [
    {
      id: 'profile',
      label: 'Career Profile',
      tab: 'profile',
      description: 'Defines target roles, academic credentials, and 3D digital presence.',
      requirement: 'Configured upon login / profile setup.',
    },
    {
      id: 'skills',
      label: 'Technical Skills Assessment',
      tab: 'skill-assessment',
      description: 'Evaluates core CS, systems, coding logic, and domain competence.',
      requirement: 'Complete the 10-question placement skill assessment.',
    },
    {
      id: 'coding',
      label: 'Algorithms & Coding Arena',
      tab: 'coding-arena',
      description: 'Hands-on DSA practice, algorithmic accuracy, and test verification.',
      requirement: 'Solve at least 1 coding problem with passed test cases.',
    },
    {
      id: 'aptitude',
      label: 'Quantitative & Logical Aptitude',
      tab: 'aptitude',
      description: 'Aptitude benchmarks required by major campus hiring filters.',
      requirement: 'Complete an aptitude arena challenge.',
    },
    {
      id: 'resume',
      label: 'Resume Intelligence & ATS',
      tab: 'resume-ai',
      description: 'Deep semantic parsing, keyword density, and ATS score benchmarking.',
      requirement: 'Upload a PDF, DOCX, or text resume file.',
    },
    {
      id: 'projects',
      label: 'Portfolio & Projects',
      tab: 'profile',
      description: 'Real-world project depth, architecture complexity, and git commits.',
      requirement: 'Extracted from resume or recorded with 2+ solved coding tasks.',
    },
    {
      id: 'techInterview',
      label: 'Technical Mock Interview',
      tab: 'tech-interview',
      description: 'Interactive 3D AI interviewer evaluating technical clarity and depth.',
      requirement: 'Complete at least 1 technical interview session.',
    },
    {
      id: 'hrInterview',
      label: 'HR & Behavioral Interview',
      tab: 'hr-interview',
      description: 'Behavioral responses, STAR methodology, leadership, and culture fit.',
      requirement: 'Complete at least 1 HR interview session.',
    },
    {
      id: 'roadmap',
      label: 'Dynamic Career Roadmap',
      tab: 'roadmap',
      description: 'Generative adaptive milestones based on calculated skill gaps.',
      requirement: 'Unlocks with active Skills/Coding + Resume/Aptitude data.',
    },
    {
      id: 'companies',
      label: 'Company Intelligence & Matching',
      tab: 'companies',
      description: 'Real compatibility percentages for Tier-1 and product companies.',
      requirement: 'Unlocks with coding and resume or skill assessments.',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider font-mono">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Spatial Neural Visualizer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            CareerNova AI Core
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A dynamic 3D neural network that evolves in real-time. Inactive nodes remain dim and disconnected until you prove mastery through authentic prep activities.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-white font-mono">
            {Object.values(state.activeNodes).filter(Boolean).length} / 10 Nodes Connected
          </span>
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className="w-full h-[520px] rounded-3xl overflow-hidden bg-slate-950/80 border border-slate-800 relative shadow-2xl">
        <CareerIntelligenceCore />
      </div>

      {/* Node Matrix Breakdown */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Neural Node Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodeList.map((item) => {
            const isActive = !!state.activeNodes[item.id as keyof typeof state.activeNodes];
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-950/50 border-slate-850 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {item.label}
                    </span>
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-400">Req:</span> {item.requirement}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => setCurrentTab(item.tab)}
                    type="button"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {isActive ? 'Manage Node' : 'Activate Node'} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
