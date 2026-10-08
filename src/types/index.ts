export type NavigationTab =
  | 'dashboard'
  | 'career-core'
  | 'coding-arena'
  | 'aptitude'
  | 'tech-interview'
  | 'hr-interview'
  | 'resume-ai'
  | 'skill-assessment'
  | 'roadmap'
  | 'companies'
  | 'ai-mentor'
  | 'analytics'
  | 'profile'
  | 'settings';

export type GenderType = 'male' | 'female';
export type HairStyle = 'fade' | 'buzz' | 'tousled' | 'waves' | 'bob' | 'slick';
export type ClothingStyle = 'cyber-hoodie' | 'tech-blazer' | 'minimal-tee' | 'neon-track' | 'formal-suit';
export type GlassesStyle = 'none' | 'tech-frames' | 'round-wire' | 'ar-visor';
export type AccessoryStyle = 'none' | 'headphones' | 'cyber-earring' | 'smart-watch' | 'neural-pin';

export interface AvatarConfig {
  gender: GenderType;
  skinTone: string; // hex
  hairStyle: HairStyle;
  hairColor: string; // hex
  clothingStyle: ClothingStyle;
  clothingColor: string; // hex
  glasses: GlassesStyle;
  accessory: AccessoryStyle;
}

export interface UserProfile {
  name: string;
  email: string;
  targetRole: string;
  targetCompanyType: string;
  graduationYear: string;
  college: string;
  avatar: AvatarConfig;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface CodingSubmission {
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Syntax Error' | 'Runtime Error';
  runtimeMs: number;
  memoryMb: number;
  passedTests: number;
  totalTests: number;
  submittedAt: string;
}

export interface ResumeAnalysisResult {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  atsScore: number;
  skillsExtracted: string[];
  missingKeywords: string[];
  experienceLevel: string;
  educationDetected: string[];
  strengths: string[];
  weaknesses: string[];
  formattingScore: number;
  recommendations: string[];
}

export interface SkillCategoryScore {
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface SkillAssessmentResult {
  completedAt: string;
  overallScore: number;
  categoryScores: SkillCategoryScore[];
  strengths: string[];
  improvementAreas: string[];
}

export interface AptitudeCategoryScore {
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation';
  score: number;
  total: number;
  correct: number;
}

export interface AptitudeTestResult {
  completedAt: string;
  overallScore: number;
  accuracy: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  categoryScores: AptitudeCategoryScore[];
}

export interface InterviewMetric {
  technicalAccuracy: number;
  problemSolving: number;
  communication: number;
  confidence: number;
  responseQuality: number;
  feedback: string[];
}

export interface InterviewSession {
  id: string;
  type: 'Technical' | 'HR';
  completedAt: string;
  metrics: InterviewMetric;
  overallScore: number;
  questionsAnswered: number;
  durationMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'achievement' | 'coding' | 'resume' | 'assessment' | 'interview' | 'system';
  read: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  user: UserProfile;
  // Metrics
  careerReadiness: number; // 0 - 100
  placementReadiness: number; // 0 - 100
  codingProblemsSolved: number;
  aptitudeScore: number; // 0 - 100
  interviewSessionsCount: number;
  resumeStatus: 'Not Uploaded' | 'Not Analyzed' | 'Analyzed';
  skillAssessmentStatus: 'Not Completed' | 'Completed';
  companyMatchPercentage: number;
  xp: number;
  level: string;
  streakDays: number;
  achievementsCount: number;

  // History & Submissions
  codingSubmissions: CodingSubmission[];
  resumeAnalysis: ResumeAnalysisResult | null;
  skillAssessment: SkillAssessmentResult | null;
  aptitudeResult: AptitudeTestResult | null;
  interviewSessions: InterviewSession[];
  notifications: NotificationItem[];

  // Core Nodes Active Status
  activeNodes: {
    profile: boolean;
    skills: boolean;
    coding: boolean;
    aptitude: boolean;
    resume: boolean;
    projects: boolean;
    techInterview: boolean;
    hrInterview: boolean;
    roadmap: boolean;
    companies: boolean;
  };
}
