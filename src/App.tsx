import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CareerCoreView } from './components/career-core/CareerCoreView';
import { CodingArena } from './components/coding/CodingArena';
import { AptitudeArena } from './components/assessments/AptitudeArena';
import { TechnicalInterview } from './components/interviews/TechnicalInterview';
import { HRInterview } from './components/interviews/HRInterview';
import { ResumeAI } from './components/resume/ResumeAI';
import { SkillAssessment } from './components/assessments/SkillAssessment';
import { CareerRoadmap } from './components/roadmap/CareerRoadmap';
import { CompanyIntelligence } from './components/companies/CompanyIntelligence';
import { AIMentor } from './components/mentor/AIMentor';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ProfileAvatarStudio } from './components/profile/ProfileAvatarStudio';
import { SettingsView } from './components/settings/SettingsView';
import { ScatteredAstraField } from './components/effects/ScatteredAstraField';
import { PandaCompanion } from './components/effects/PandaCompanion';

const AppShell: React.FC = () => {
  const { state, currentTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // RULE 1: The first screen must always be the login page. Do NOT show the dashboard before login.
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  // Dashboard & Authenticated Layout with Scattered Astra Effects
  return (
    <div className="relative min-h-screen w-full bg-[#060814] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Scattered Astra Effects in Post-Login Background */}
      <ScatteredAstraField />

      {/* Persistent Interactive Nova & Astra Panda Squad Companion */}
      <PandaCompanion />

      {/* 3-Zone Top Bar */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Container with Sidebar + Main Viewport */}
      <div className="relative z-10 flex-1 flex w-full">
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Viewport Content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'career-core' && <CareerCoreView />}
          {currentTab === 'coding-arena' && <CodingArena />}
          {currentTab === 'aptitude' && <AptitudeArena />}
          {currentTab === 'tech-interview' && <TechnicalInterview />}
          {currentTab === 'hr-interview' && <HRInterview />}
          {currentTab === 'resume-ai' && <ResumeAI />}
          {currentTab === 'skill-assessment' && <SkillAssessment />}
          {currentTab === 'roadmap' && <CareerRoadmap />}
          {currentTab === 'companies' && <CompanyIntelligence />}
          {currentTab === 'ai-mentor' && <AIMentor />}
          {currentTab === 'analytics' && <AnalyticsView />}
          {currentTab === 'profile' && <ProfileAvatarStudio />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
