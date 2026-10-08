import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Cpu,
  Code2,
  Brain,
  Video,
  Users2,
  FileText,
  Award,
  Compass,
  Building2,
  Bot,
  BarChart3,
  UserCheck,
  Settings,
  Flame,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentTab, setCurrentTab, state } = useApp();

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    activeCondition?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'career-core',
      label: 'Career Intelligence',
      icon: Cpu,
      badge: `${Object.values(state.activeNodes).filter(Boolean).length}/10`,
    },
    {
      id: 'coding-arena',
      label: 'Coding Arena',
      icon: Code2,
      badge: state.codingProblemsSolved > 0 ? `${state.codingProblemsSolved} Solved` : undefined,
    },
    {
      id: 'aptitude',
      label: 'Aptitude Arena',
      icon: Brain,
      badge: state.aptitudeResult ? `${state.aptitudeScore}%` : undefined,
    },
    {
      id: 'tech-interview',
      label: 'Technical Interview',
      icon: Video,
      badge: state.interviewSessions.filter((s) => s.type === 'Technical').length > 0 ? 'Ready' : undefined,
    },
    {
      id: 'hr-interview',
      label: 'HR Interview',
      icon: Users2,
      badge: state.interviewSessions.filter((s) => s.type === 'HR').length > 0 ? 'Ready' : undefined,
    },
    {
      id: 'resume-ai',
      label: 'Resume AI',
      icon: FileText,
      badge: state.resumeAnalysis ? `${state.resumeAnalysis.atsScore}% ATS` : undefined,
    },
    {
      id: 'skill-assessment',
      label: 'Skill Assessment',
      icon: Award,
      badge: state.skillAssessment ? `${state.skillAssessment.overallScore}%` : undefined,
    },
    {
      id: 'roadmap',
      label: 'Career Roadmap',
      icon: Compass,
      badge: state.activeNodes.roadmap ? 'Unlocked' : 'Locked',
    },
    {
      id: 'companies',
      label: 'Companies Match',
      icon: Building2,
      badge: state.activeNodes.companies ? `${state.companyMatchPercentage}%` : 'Locked',
    },
    {
      id: 'ai-mentor',
      label: 'AI Mentor',
      icon: Bot,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'profile',
      label: '3D Avatar & Profile',
      icon: UserCheck,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleSelect = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#060814]/80 backdrop-blur-2xl text-slate-300 border-r border-slate-800/80">
      {/* Upper Navigation List */}
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Section 1: Main Platform */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-mono">
            Platform Hub
          </div>
          <nav className="space-y-1">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Preparation Modules */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-mono">
            Placement Prep
          </div>
          <nav className="space-y-1">
            {navItems.slice(4, 8).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Intelligence & Strategy */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-mono">
            Intelligence & Strategy
          </div>
          <nav className="space-y-1">
            {navItems.slice(8).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.badge === 'Locked'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Career Status Footer Card */}
      <div className="pt-4 mt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5 font-mono">
            <span>READINESS</span>
            <span className="text-cyan-400 font-bold">{state.careerReadiness}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.max(4, state.careerReadiness)}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">{state.level}</span>
            <span className="text-cyan-400 font-mono">{state.xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 h-[calc(100vh-57px)] shrink-0 sticky top-[57px]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
