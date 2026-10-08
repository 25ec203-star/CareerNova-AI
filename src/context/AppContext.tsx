import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppState,
  UserProfile,
  CodingSubmission,
  ResumeAnalysisResult,
  SkillAssessmentResult,
  AptitudeTestResult,
  InterviewSession,
  NotificationItem,
  NavigationTab,
  AvatarConfig,
} from '../types';

const INITIAL_AVATAR: AvatarConfig = {
  gender: 'male',
  skinTone: '#E0AC69',
  hairStyle: 'fade',
  hairColor: '#1A1A1A',
  clothingStyle: 'cyber-hoodie',
  clothingColor: '#00F0FF',
  glasses: 'none',
  accessory: 'headphones',
};

const INITIAL_USER: UserProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@placement.edu',
  targetRole: 'Full Stack AI Engineer',
  targetCompanyType: 'Product Tier-1 / Tech Giant',
  graduationYear: '2026',
  college: 'Institute of Technology',
  avatar: INITIAL_AVATAR,
};

const INITIAL_STATE: AppState = {
  isAuthenticated: false,
  user: INITIAL_USER,
  careerReadiness: 0,
  placementReadiness: 0,
  codingProblemsSolved: 0,
  aptitudeScore: 0,
  interviewSessionsCount: 0,
  resumeStatus: 'Not Analyzed',
  skillAssessmentStatus: 'Not Completed',
  companyMatchPercentage: 0,
  xp: 0,
  level: 'Career Explorer',
  streakDays: 0,
  achievementsCount: 0,

  codingSubmissions: [],
  resumeAnalysis: null,
  skillAssessment: null,
  aptitudeResult: null,
  interviewSessions: [],
  notifications: [],

  activeNodes: {
    profile: false,
    skills: false,
    coding: false,
    aptitude: false,
    resume: false,
    projects: false,
    techInterview: false,
    hrInterview: false,
    roadmap: false,
    companies: false,
  },
};

interface AppContextType {
  state: AppState;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateAvatar: (avatar: Partial<AvatarConfig>) => void;
  recordCodingSubmission: (submission: CodingSubmission) => void;
  recordResumeAnalysis: (result: ResumeAnalysisResult) => void;
  recordSkillAssessment: (result: SkillAssessmentResult) => void;
  recordAptitudeResult: (result: AptitudeTestResult) => void;
  recordInterviewSession: (session: InterviewSession) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markNotificationsAsRead: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'careernova_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_STATE,
          ...parsed,
          isAuthenticated: parsed.isAuthenticated || false,
        };
      }
    } catch {
      // Ignore parse error, use default
    }
    return INITIAL_STATE;
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failure
    }
  }, [state]);

  // Dynamic Level Calculation
  const calculateLevel = (xp: number): string => {
    if (xp >= 1500) return 'Elite Placement Ready';
    if (xp >= 1000) return 'Advanced Candidate';
    if (xp >= 600) return 'Career Specialist';
    if (xp >= 250) return 'Skilled Apprentice';
    return 'Career Explorer';
  };

  // Re-calculate readiness scores dynamically based strictly on real activity
  const recalculateMetrics = (currentState: AppState): AppState => {
    const hasResume = currentState.resumeAnalysis !== null;
    const hasSkills = currentState.skillAssessment !== null;
    const hasAptitude = currentState.aptitudeResult !== null;
    const solvedCount = currentState.codingProblemsSolved;
    const interviewCount = currentState.interviewSessionsCount;

    // Active nodes mapping
    const activeNodes = {
      profile: currentState.activeNodes.profile,
      skills: hasSkills,
      coding: solvedCount > 0,
      aptitude: hasAptitude,
      resume: hasResume,
      projects: solvedCount >= 2 || (hasResume && (currentState.resumeAnalysis?.experienceLevel !== 'None' || false)),
      techInterview: currentState.interviewSessions.some((s) => s.type === 'Technical'),
      hrInterview: currentState.interviewSessions.some((s) => s.type === 'HR'),
      roadmap: (hasSkills || solvedCount > 0) && (hasResume || hasAptitude),
      companies: (hasResume || hasSkills) && solvedCount > 0,
    };

    // Calculate Career Readiness based on genuine milestones
    // Total 100%: Resume (20%), Skills (20%), Coding (20%), Aptitude (20%), Interviews (20%)
    let careerScore = 0;
    if (hasResume) {
      careerScore += Math.round((currentState.resumeAnalysis?.atsScore || 60) * 0.2);
    }
    if (hasSkills) {
      careerScore += Math.round((currentState.skillAssessment?.overallScore || 0) * 0.2);
    }
    if (solvedCount > 0) {
      const codingNorm = Math.min(100, solvedCount * 25);
      careerScore += Math.round(codingNorm * 0.2);
    }
    if (hasAptitude) {
      careerScore += Math.round((currentState.aptitudeResult?.overallScore || 0) * 0.2);
    }
    if (interviewCount > 0) {
      const avgInterview =
        currentState.interviewSessions.reduce((acc, s) => acc + s.overallScore, 0) /
        (currentState.interviewSessions.length || 1);
      careerScore += Math.round(avgInterview * 0.2);
    }

    // Placement Readiness focuses on rigorous interview + coding + aptitude
    let placementScore = 0;
    const totalComponents = (solvedCount > 0 ? 1 : 0) + (hasAptitude ? 1 : 0) + (interviewCount > 0 ? 1 : 0) + (hasSkills ? 1 : 0);
    if (totalComponents > 0) {
      const codingVal = Math.min(100, solvedCount * 25);
      const aptVal = currentState.aptitudeResult?.overallScore || 0;
      const skillVal = currentState.skillAssessment?.overallScore || 0;
      const interviewVal = interviewCount > 0
        ? currentState.interviewSessions.reduce((acc, s) => acc + s.overallScore, 0) / currentState.interviewSessions.length
        : 0;
      placementScore = Math.round((codingVal * 0.3 + aptVal * 0.25 + skillVal * 0.2 + interviewVal * 0.25));
    }

    // Company Match: 0% until both profile/resume or skills and coding exist
    let companyMatch = 0;
    if (activeNodes.companies) {
      companyMatch = Math.min(95, Math.max(15, Math.round((careerScore * 0.6 + placementScore * 0.4))));
    }

    // Count achievements
    let achievements = 0;
    if (solvedCount >= 1) achievements++;
    if (solvedCount >= 3) achievements++;
    if (hasResume) achievements++;
    if (hasSkills) achievements++;
    if (hasAptitude) achievements++;
    if (interviewCount >= 1) achievements++;
    if (careerScore >= 50) achievements++;

    return {
      ...currentState,
      careerReadiness: Math.min(100, careerScore),
      placementReadiness: Math.min(100, placementScore),
      companyMatchPercentage: companyMatch,
      activeNodes,
      achievementsCount: achievements,
      level: calculateLevel(currentState.xp),
    };
  };

  const login = (userData?: Partial<UserProfile>) => {
    setState((prev) => {
      const updatedUser = userData ? { ...prev.user, ...userData } : prev.user;
      return {
        ...prev,
        isAuthenticated: true,
        user: updatedUser,
        streakDays: prev.streakDays === 0 ? 1 : prev.streakDays,
        activeNodes: {
          ...prev.activeNodes,
          profile: true,
        },
      };
    });
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setState((prev) => {
      const next = {
        ...prev,
        user: { ...prev.user, ...profile },
        activeNodes: { ...prev.activeNodes, profile: true },
        xp: prev.xp + 25,
      };
      return recalculateMetrics(next);
    });
    addNotification('Profile Updated', 'Your career preferences and academic details were saved.', 'system');
  };

  const updateAvatar = (avatarUpdate: Partial<AvatarConfig>) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        avatar: { ...prev.user.avatar, ...avatarUpdate },
      },
    }));
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setState((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 20),
    }));
  };

  const markNotificationsAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const recordCodingSubmission = (submission: CodingSubmission) => {
    setState((prev) => {
      const newSubmissions = [submission, ...prev.codingSubmissions];
      const uniqueSolved = new Set(
        newSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)
      ).size;

      const gainedXp = submission.status === 'Accepted' ? 100 : 25;
      const next = {
        ...prev,
        codingSubmissions: newSubmissions,
        codingProblemsSolved: uniqueSolved,
        xp: prev.xp + gainedXp,
      };
      return recalculateMetrics(next);
    });

    if (submission.status === 'Accepted') {
      addNotification('Coding Challenge Solved', `Accepted solution for ${submission.problemTitle}! +100 XP`, 'coding');
    } else {
      addNotification('Coding Attempt Recorded', `Submission recorded for ${submission.problemTitle}.`, 'coding');
    }
  };

  const recordResumeAnalysis = (result: ResumeAnalysisResult) => {
    setState((prev) => {
      const next = {
        ...prev,
        resumeAnalysis: result,
        resumeStatus: 'Analyzed' as const,
        xp: prev.xp + 150,
      };
      return recalculateMetrics(next);
    });
    addNotification('Resume Intelligence Active', `Resume parsed. ATS score: ${result.atsScore}% with ${result.skillsExtracted.length} skills identified.`, 'resume');
  };

  const recordSkillAssessment = (result: SkillAssessmentResult) => {
    setState((prev) => {
      const next = {
        ...prev,
        skillAssessment: result,
        skillAssessmentStatus: 'Completed' as const,
        xp: prev.xp + 200,
      };
      return recalculateMetrics(next);
    });
    addNotification('Skill Assessment Completed', `Assessment completed with ${result.overallScore}% overall competence. +200 XP`, 'assessment');
  };

  const recordAptitudeResult = (result: AptitudeTestResult) => {
    setState((prev) => {
      const next = {
        ...prev,
        aptitudeResult: result,
        aptitudeScore: result.overallScore,
        xp: prev.xp + 150,
      };
      return recalculateMetrics(next);
    });
    addNotification('Aptitude Assessment Completed', `Aptitude evaluation finished: ${result.overallScore}% score. +150 XP`, 'assessment');
  };

  const recordInterviewSession = (session: InterviewSession) => {
    setState((prev) => {
      const updated = [session, ...prev.interviewSessions];
      const next = {
        ...prev,
        interviewSessions: updated,
        interviewSessionsCount: updated.length,
        xp: prev.xp + 250,
      };
      return recalculateMetrics(next);
    });
    addNotification(
      `${session.type} Mock Interview Recorded`,
      `Completed with ${session.overallScore}% performance score. +250 XP`,
      'interview'
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...INITIAL_STATE,
      isAuthenticated: true, // remain in dashboard with 0 stats
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentTab,
        setCurrentTab,
        login,
        logout,
        updateProfile,
        updateAvatar,
        recordCodingSubmission,
        recordResumeAnalysis,
        recordSkillAssessment,
        recordAptitudeResult,
        recordInterviewSession,
        addNotification,
        markNotificationsAsRead,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
