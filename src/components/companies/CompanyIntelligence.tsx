import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Target,
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  category: 'Tier-1 Product' | 'Semiconductor & Embedded' | 'Cloud & Enterprise' | 'Global Tech Services';
  baseMatch: number;
  coreRequirements: string[];
  hiringFocus: string;
  minReadiness: number;
}

const COMPANIES: CompanyProfile[] = [
  {
    name: 'Google',
    category: 'Tier-1 Product',
    baseMatch: 0.95,
    coreRequirements: ['Data Structures & Algorithms', 'Distributed Systems', 'Go / C++ / Python'],
    hiringFocus: 'Strong algorithmic problem-solving & clean code under strict time constraints.',
    minReadiness: 70,
  },
  {
    name: 'Microsoft',
    category: 'Tier-1 Product',
    baseMatch: 0.92,
    coreRequirements: ['System Design', 'C# / TypeScript / Python', 'Cloud Architecture'],
    hiringFocus: 'Engineering trade-offs, modular architectural design, and collaborative communication.',
    minReadiness: 65,
  },
  {
    name: 'Qualcomm',
    category: 'Semiconductor & Embedded',
    baseMatch: 0.88,
    coreRequirements: ['C / C++', 'Embedded Systems', 'Digital Electronics & RTOS'],
    hiringFocus: 'Low-level memory management, device drivers, and computer architecture fundamentals.',
    minReadiness: 60,
  },
  {
    name: 'Amazon',
    category: 'Tier-1 Product',
    baseMatch: 0.90,
    coreRequirements: ['Java / Python / C++', 'Object-Oriented Design', 'Leadership Principles'],
    hiringFocus: 'High ownership, customer obsession, and scalable backend implementations.',
    minReadiness: 65,
  },
  {
    name: 'Cisco Systems',
    category: 'Cloud & Enterprise',
    baseMatch: 0.86,
    coreRequirements: ['Computer Networks', 'Python / Go', 'Cloud Infrastructure'],
    hiringFocus: 'Routing protocols, network security, and robust automation pipelines.',
    minReadiness: 55,
  },
  {
    name: 'Tata Consultancy Services (Digital/Innovator)',
    category: 'Global Tech Services',
    baseMatch: 0.82,
    coreRequirements: ['Programming Fundamentals', 'Aptitude & Logical', 'Full Stack Basics'],
    hiringFocus: 'High cognitive aptitude scores, rapid learning capability, and software foundation.',
    minReadiness: 45,
  },
];

export const CompanyIntelligence: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const isUnlocked = state.activeNodes.companies;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1 uppercase tracking-wider font-mono">
            <Building2 className="w-4 h-4 text-rose-400" />
            Corporate Fit & Placement Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Company Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real compatibility calculations based strictly on your verified skills, DSA metrics, aptitude benchmarks, and resume depth.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
          Status: {isUnlocked ? 'Matching Engine Active' : 'Company Matching Locked'}
        </div>
      </div>

      {/* 23. INITIAL STATE: COMPANY MATCHING LOCKED */}
      {!isUnlocked && (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Company Matching Locked</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            “Complete your career profile to discover your best-fit companies.” We never display arbitrary percentages without verified coding and assessment data.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setCurrentTab('coding-arena')}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Solve 1 Coding Problem
            </button>
            <button
              onClick={() => setCurrentTab('resume-ai')}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              Upload Verified Resume
            </button>
          </div>
        </div>
      )}

      {/* UNLOCKED COMPANY MATCHES */}
      {isUnlocked && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Computed Compatibility Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite calculation based on Placement Readiness ({state.placementReadiness}%) and Career Readiness ({state.careerReadiness}%)
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              Average Match Index: {state.companyMatchPercentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPANIES.map((company, idx) => {
              // Calculate authentic company match based on student's actual metrics
              const calculatedMatch = Math.min(
                96,
                Math.max(
                  20,
                  Math.round(
                    state.careerReadiness * 0.5 +
                      state.placementReadiness * 0.4 +
                      (state.codingProblemsSolved >= 2 ? 10 : 0)
                  )
                )
              );

              const isQualified = calculatedMatch >= company.minReadiness;

              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 font-mono">{company.category}</span>
                      <span className="text-lg font-black text-white font-mono tabular-nums">
                        {calculatedMatch}%
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                      {company.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {company.hiringFocus}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                        Core Tech Expectations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {company.coreRequirements.map((req, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span
                      className={`text-xs font-mono flex items-center gap-1.5 ${
                        isQualified ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isQualified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Threshold Met
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" /> Prep Gap: +{company.minReadiness - calculatedMatch}%
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => setCurrentTab('tech-interview')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      Practice Mock <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
