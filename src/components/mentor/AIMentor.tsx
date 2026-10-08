import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarViewer } from '../3d/AvatarViewer';
import {
  Bot,
  Sparkles,
  Send,
  Compass,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
}

export const AIMentor: React.FC = () => {
  const { state, setCurrentTab } = useApp();

  const isZeroData =
    state.codingProblemsSolved === 0 &&
    state.aptitudeScore === 0 &&
    state.interviewSessionsCount === 0 &&
    !state.resumeAnalysis &&
    !state.skillAssessment;

  const initialGreeting = isZeroData
    ? "“I’m ready to help you build your career profile.” Complete your first skill assessment, solve coding problems, or upload your resume so I can formulate targeted placement intelligence tailored to your authentic data."
    : `Welcome back, ${state.user.name}. I've synthesized your current telemetry: Career Readiness is at ${state.careerReadiness}% with ${state.codingProblemsSolved} coding challenges solved and ${state.resumeStatus === 'Analyzed' ? `${state.resumeAnalysis?.atsScore}% ATS score` : 'resume pending'}. How can I strategize your placement trajectory today?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'mentor',
      text: initialGreeting,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (isZeroData) {
        reply =
          "Before I can provide reliable placement probabilities, I need authentic data points. I recommend taking the 5-minute Skill Assessment or solving the Two Sum challenge in the Coding Arena first.";
      } else if (lower.includes('ready') || lower.includes('google') || lower.includes('tier-1')) {
        reply = `Based on your current Placement Readiness (${state.placementReadiness}%), you have unlocked ${Object.values(state.activeNodes).filter(Boolean).length} of 10 intelligence nodes. Tier-1 campus hiring requires consistent scores >75% across Algorithms and Technical Interviews. ${
          state.codingProblemsSolved < 3
            ? 'Your top priority is solving more problems in the Coding Arena.'
            : 'Your DSA baseline is improving. Next, schedule a Technical Mock Interview to hone real-time explanation.'
        }`;
      } else if (lower.includes('resume') || lower.includes('ats')) {
        if (state.resumeAnalysis) {
          reply = `Your parsed ATS score is ${state.resumeAnalysis.atsScore}%. To raise it above 85%, incorporate missing keywords like ${state.resumeAnalysis.missingKeywords.slice(0, 3).join(', ')} and add quantifiable metrics (e.g. latency reductions or throughput improvements) into project bullet points.`;
        } else {
          reply =
            'You have not uploaded a resume yet. Head over to the Resume AI module to parse your document so we can extract verified skills and detect missing keywords.';
        }
      } else if (lower.includes('prioritize') || lower.includes('next') || lower.includes('week')) {
        if (!state.skillAssessment) {
          reply = 'Priority 1: Complete the Skill Assessment to calibrate your CS & systems foundation.';
        } else if (state.codingProblemsSolved === 0) {
          reply = 'Priority 1: Solve the Two Sum and Valid Palindrome problems in the Coding Arena.';
        } else if (!state.aptitudeResult) {
          reply = 'Priority 1: Take an Aptitude challenge to ensure you pass preliminary online assessments (OA).';
        } else if (state.interviewSessionsCount === 0) {
          reply = 'Priority 1: Conduct a Technical Mock Interview with Dr. Nova to assess communication clarity.';
        } else {
          reply =
            'You have built a solid foundation! Focus on optimizing your resume keywords and practice edge-case handling in Coding Arena.';
        }
      } else {
        reply = `As your Career Strategist for ${state.user.targetRole}, I evaluate every recommendation against actual hiring benchmarks. Currently: Coding Solved = ${state.codingProblemsSolved}, Aptitude = ${state.aptitudeScore}%, Resume = ${state.resumeStatus}. Keep completing activities to advance your Career Intelligence profile!`;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Placement Strategist
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            CareerNova AI Mentor
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Adaptive career advisory that grows increasingly personalized as your authentic performance data expands.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Nova Intelligence</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {isZeroData ? 'Awaiting Data Calibration' : 'Personalized Strategy Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat Container */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between h-[560px] shadow-2xl">
          {/* Chat Messages */}
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'mentor' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1.5 block text-right">
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5 overflow-hidden">
                    <AvatarViewer size="xs" interactive={false} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Nova Mentor is formulating advice...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto py-3 border-t border-slate-850">
            {[
              'What should I prioritize this week?',
              'How do I improve my ATS score?',
              'Am I ready for Product Tier-1 companies?',
              'How to structure my technical answers?',
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your AI career strategist anything..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              type="button"
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Strategy Insights Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Strategic Data Inputs
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Skill Assessment</span>
                <span className="font-mono text-white">
                  {state.skillAssessmentStatus === 'Completed' ? 'Completed' : 'Not completed'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Coding Problems</span>
                <span className="font-mono text-white">{state.codingProblemsSolved} Solved</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Aptitude Benchmark</span>
                <span className="font-mono text-white">
                  {state.aptitudeResult ? `${state.aptitudeScore}%` : 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Resume ATS</span>
                <span className="font-mono text-white">
                  {state.resumeStatus === 'Analyzed' ? `${state.resumeAnalysis?.atsScore}%` : 'Not uploaded'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Mock Interviews</span>
                <span className="font-mono text-white">{state.interviewSessionsCount} Sessions</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed">
              The AI mentor never invents strengths or guarantees placements until verified assessments demonstrate mastery.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
