import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillAssessmentResult, SkillCategoryScore } from '../../types';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  category: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Programming',
    text: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Balanced BSTs maintain height logarithmic relative to n, giving O(log n) search time.',
  },
  {
    id: 2,
    category: 'Electronics',
    text: 'In an operational amplifier (Op-Amp) with negative feedback in inverting configuration, what is the ideal voltage between inverting and non-inverting terminals?',
    options: ['Supply Voltage (Vcc)', 'Virtual Ground (0 V)', 'Infinity', '0.7 V forward drop'],
    correctIndex: 1,
    explanation: 'Due to infinite open loop gain, negative feedback enforces a virtual short (0V differential).',
  },
  {
    id: 3,
    category: 'Embedded Systems',
    text: 'Which microcontroller mechanism temporarily suspends the main execution loop to handle time-critical external hardware signals?',
    options: ['Polling loop', 'Interrupt Service Routine (ISR)', 'Watchdog timer reset', 'DMA controller bus lock'],
    correctIndex: 1,
    explanation: 'Hardware interrupts trigger an ISR to service immediate events with minimal latency.',
  },
  {
    id: 4,
    category: 'Digital Electronics',
    text: 'How many select lines are required for an 8-to-1 Multiplexer (MUX)?',
    options: ['2', '3', '4', '8'],
    correctIndex: 1,
    explanation: '2^k = 8 => k = 3 select lines are required to address 8 data input channels.',
  },
  {
    id: 5,
    category: 'Communication',
    text: 'Which transport layer protocol provides connection-oriented, ordered, and error-checked byte stream delivery?',
    options: ['UDP', 'ICMP', 'TCP', 'ARP'],
    correctIndex: 2,
    explanation: 'TCP (Transmission Control Protocol) establishes a 3-way handshake and handles sequence ordering.',
  },
  {
    id: 6,
    category: 'Problem Solving',
    text: 'You have 8 identical-looking coins, one of which is counterfeit and slightly lighter. What is the minimum balance-scale weighings guaranteed to identify it?',
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Divide into 3-3-2 groups. 1st weighing narrows down to 3 or 2; 2nd weighing pinpoints the light coin.',
  },
  {
    id: 7,
    category: 'Aptitude',
    text: 'A train 180 meters long travels at 72 km/h. How many seconds does it take to cross an electric post?',
    options: ['6 seconds', '9 seconds', '12 seconds', '15 seconds'],
    correctIndex: 1,
    explanation: '72 km/h = 72 * (5/18) = 20 m/s. Time = Distance / Speed = 180 / 20 = 9 seconds.',
  },
  {
    id: 8,
    category: 'Communication Skills',
    text: 'When explaining a complex engineering trade-off in an interview, which technique is most effective for executive clarity?',
    options: [
      'Speak very fast to demonstrate expertise',
      'Use the STAR method (Situation, Task, Action, Result) with quantified impact',
      'Avoid mentioning any challenges or limitations',
      'Use obscure acronyms without defining them',
    ],
    correctIndex: 1,
    explanation: 'STAR structured communication clearly grounds problem context, chosen actions, and measurable outcomes.',
  },
];

export const SkillAssessment: React.FC = () => {
  const { state, recordSkillAssessment } = useApp();

  const [inProgress, setInProgress] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const startQuiz = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setTimeLeft(300);
    setInProgress(true);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    // Calculate results
    const catMap: Record<string, { total: number; correct: number }> = {};

    QUESTIONS.forEach((q) => {
      if (!catMap[q.category]) catMap[q.category] = { total: 0, correct: 0 };
      catMap[q.category].total++;
      if (selectedAnswers[q.id] === q.correctIndex) {
        catMap[q.category].correct++;
      }
    });

    const categoryScores: SkillCategoryScore[] = Object.entries(catMap).map(([category, stats]) => ({
      category,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      score: Math.round((stats.correct / stats.total) * 100),
    }));

    const totalCorrect = Object.values(catMap).reduce((a, b) => a + b.correct, 0);
    const overallScore = Math.round((totalCorrect / QUESTIONS.length) * 100);

    const strengths = categoryScores.filter((c) => c.score >= 80).map((c) => c.category);
    const improvementAreas = categoryScores.filter((c) => c.score < 80).map((c) => c.category);

    const result: SkillAssessmentResult = {
      completedAt: new Date().toLocaleTimeString(),
      overallScore,
      categoryScores,
      strengths: strengths.length > 0 ? strengths : ['Basic technical fundamentals'],
      improvementAreas: improvementAreas.length > 0 ? improvementAreas : ['Ready for advanced Tier-1 challenges'],
    };

    setInProgress(false);
    recordSkillAssessment(result);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const assessment = state.skillAssessment;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider font-mono">
            <Award className="w-4 h-4 text-emerald-400" />
            Core Placement Competency Filter
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill Assessment
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Covers essential programming, digital electronics, embedded systems, network communication, and behavioral metrics.
          </p>
        </div>

        {assessment && !inProgress && (
          <button
            onClick={startQuiz}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        )}
      </div>

      {/* 17. INITIAL STATE: NOT COMPLETED */}
      {!assessment && !inProgress && (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Skill Assessment Not Completed
          </h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Take our 8-domain placement readiness benchmark to test your engineering fundamentals and ignite your Skills Core Node.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full text-left text-xs mb-8 font-mono">
            {[
              'Programming',
              'Electronics',
              'Embedded Systems',
              'Digital Electronics',
              'Communication',
              'Problem Solving',
              'Aptitude',
              'Communication Skills',
            ].map((cat, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate">{cat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={startQuiz}
            type="button"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* IN PROGRESS QUIZ */}
      {inProgress && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl space-y-6">
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400">
              Question <span className="text-white font-bold">{currentIdx + 1}</span> of {QUESTIONS.length}
            </span>
            <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Assessment Active</span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono mb-2">
              Domain: {QUESTIONS[currentIdx].category}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {QUESTIONS[currentIdx].text}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {QUESTIONS[currentIdx].options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[QUESTIONS[currentIdx].id] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(QUESTIONS[currentIdx].id, oIdx)}
                  type="button"
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-mono shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>

            {currentIdx < QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                type="button"
                className="px-5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                type="button"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition cursor-pointer"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* 17. COMPLETED RESULTS STATE */}
      {assessment && !inProgress && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Assessment Verified · {assessment.completedAt}
              </span>
              <h2 className="text-2xl font-black text-white">Overall Skill Competence</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                Your performance scores have been fed into the Career Intelligence Core to recalculate your Placement Readiness.
              </p>
            </div>

            <div className="flex items-baseline gap-2 px-6 py-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
              <span className="text-4xl font-black text-emerald-400 font-mono tabular-nums">
                {assessment.overallScore}%
              </span>
              <span className="text-xs text-slate-500 font-mono">Competence</span>
            </div>
          </div>

          {/* Category Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assessment.categoryScores.map((cat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="truncate">{cat.category}</span>
                    <span className="font-mono text-white font-bold">{cat.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${
                        cat.score >= 80 ? 'bg-emerald-400' : cat.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-3 font-mono">
                  {cat.correctAnswers}/{cat.totalQuestions} Questions Correct
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
