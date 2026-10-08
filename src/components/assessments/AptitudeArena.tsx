import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AptitudeTestResult, AptitudeCategoryScore } from '../../types';
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  BarChart2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AptitudeQuestion {
  id: number;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 1,
    category: 'Quantitative',
    question: 'A shopkeeper sells an article at a discount of 15% on the marked price and still gains 19%. What is the marked price if the cost price is $250?',
    options: ['$320', '$350', '$360', '$375'],
    correct: 1,
    explanation: 'Selling Price = 250 * 1.19 = $297.5. Marked Price * 0.85 = 297.5 => MP = 297.5 / 0.85 = $350.',
  },
  {
    id: 2,
    category: 'Quantitative',
    question: 'Two pipes A and B can fill a cistern in 20 and 30 minutes respectively. Both pipes being opened, when should pipe A be turned off so that the tank may be just filled in 15 minutes?',
    options: ['8 min', '10 min', '12 min', '14 min'],
    correct: 1,
    explanation: 'Pipe B works all 15 min => fills 15/30 = 1/2 of tank. Remaining 1/2 filled by A in (1/2) * 20 = 10 minutes.',
  },
  {
    id: 3,
    category: 'Logical Reasoning',
    question: 'Statements: All laptops are devices. Some devices are gadgets. Conclusion I: Some laptops are gadgets. Conclusion II: No laptop is a gadget.',
    options: ['Only I follows', 'Only II follows', 'Either I or II follows', 'Neither follows'],
    correct: 2,
    explanation: 'Since laptops and gadgets share a complementary pair under uncertain middle term, Either I or II follows.',
  },
  {
    id: 4,
    category: 'Logical Reasoning',
    question: 'In a code, "ENGINEER" is written as "FOHJOFFS". How is "SYSTEM" written in that same code pattern?',
    options: ['TZTUFN', 'TFTUFN', 'TZUVFN', 'TYTUFN'],
    correct: 0,
    explanation: 'Each character is shifted by +1 in alphabetical index: S->T, Y->Z, S->T, T->U, E->F, M->N => TZTUFN.',
  },
  {
    id: 5,
    category: 'Verbal Ability',
    question: 'Select the synonym for the word "EPHEMERAL":',
    options: ['Enduring', 'Transient', 'Substantial', 'Perpetual'],
    correct: 1,
    explanation: 'Ephemeral means lasting for a very short time; transient.',
  },
  {
    id: 6,
    category: 'Verbal Ability',
    question: 'Identify the grammatically correct sentence:',
    options: [
      'Neither the manager nor the engineers was present at the deployment.',
      'Neither the manager nor the engineers were present at the deployment.',
      'Neither the manager or the engineers was present at the deployment.',
      'Neither the manager nor the engineers is present at the deployment.',
    ],
    correct: 1,
    explanation: 'With "Neither... nor", the verb agrees with the closer subject ("engineers" is plural, so "were").',
  },
  {
    id: 7,
    category: 'Data Interpretation',
    question: 'A company reports quarterly revenues: Q1=$12M, Q2=$15M, Q3=$18M, Q4=$27M. What is the percentage increase from Q1 to Q4?',
    options: ['100%', '125%', '150%', '225%'],
    correct: 1,
    explanation: 'Increase = (27 - 12) / 12 = 15 / 12 = 1.25 => 125% increase.',
  },
  {
    id: 8,
    category: 'Data Interpretation',
    question: 'In a software team, 60% write Backend, 50% write Frontend, and 30% write both. What percentage write neither?',
    options: ['10%', '15%', '20%', '25%'],
    correct: 2,
    explanation: 'Total writing either = 60 + 50 - 30 = 80%. Therefore, 100% - 80% = 20% write neither.',
  },
];

export const AptitudeArena: React.FC = () => {
  const { state, recordAptitudeResult } = useApp();

  const [inProgress, setInProgress] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<number, number>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let timer: any;
    if (inProgress) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inProgress]);

  const handleStart = () => {
    setUserChoices({});
    setCurrentIdx(0);
    setSecondsElapsed(0);
    setInProgress(true);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    setUserChoices((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinish = () => {
    let correctCount = 0;
    const catMap: Record<string, { total: number; correct: number }> = {
      Quantitative: { total: 0, correct: 0 },
      'Logical Reasoning': { total: 0, correct: 0 },
      'Verbal Ability': { total: 0, correct: 0 },
      'Data Interpretation': { total: 0, correct: 0 },
    };

    APTITUDE_QUESTIONS.forEach((q) => {
      catMap[q.category].total++;
      if (userChoices[q.id] === q.correct) {
        catMap[q.category].correct++;
        correctCount++;
      }
    });

    const overallScore = Math.round((correctCount / APTITUDE_QUESTIONS.length) * 100);
    const accuracy = overallScore;

    const categoryScores: AptitudeCategoryScore[] = Object.entries(catMap).map(([k, v]) => ({
      category: k as any,
      score: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
      total: v.total,
      correct: v.correct,
    }));

    const result: AptitudeTestResult = {
      completedAt: new Date().toLocaleTimeString(),
      overallScore,
      accuracy,
      timeSpentSeconds: secondsElapsed,
      totalQuestions: APTITUDE_QUESTIONS.length,
      correctAnswers: correctCount,
      categoryScores,
    };

    setInProgress(false);
    recordAptitudeResult(result);

    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const result = state.aptitudeResult;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider font-mono">
            <Brain className="w-4 h-4 text-amber-400" />
            Quantitative & Cognitive Reasoning
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Aptitude Arena
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulates genuine placement entrance examinations across Quantitative, Logical, Verbal, and Data Interpretation.
          </p>
        </div>

        {result && !inProgress && (
          <button
            onClick={handleStart}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Aptitude Test
          </button>
        )}
      </div>

      {/* 18. INITIAL STATE: NO ASSESSMENT COMPLETED */}
      {!result && !inProgress && (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No assessment completed</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Major tech companies use cognitive aptitude rounds as their primary elimination filter. Complete this timed arena challenge to evaluate your metrics.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full text-left text-xs mb-8">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-semibold text-white block">Quantitative Aptitude</span>
              <span className="text-[11px] text-slate-500">Speed, distance, percentages & profit</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-semibold text-white block">Logical Reasoning</span>
              <span className="text-[11px] text-slate-500">Deduction, syllogisms & coding patterns</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-semibold text-white block">Verbal Ability</span>
              <span className="text-[11px] text-slate-500">Vocabulary, grammar & context usage</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-semibold text-white block">Data Interpretation</span>
              <span className="text-[11px] text-slate-500">Tabular synthesis & growth analytics</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            type="button"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
          >
            <span>Start Aptitude Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUIZ IN PROGRESS */}
      {inProgress && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400">
              Question <span className="text-white font-bold">{currentIdx + 1}</span> of {APTITUDE_QUESTIONS.length}
            </span>
            <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor(secondsElapsed / 60)}:
                {String(secondsElapsed % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono mb-2">
              Category: {APTITUDE_QUESTIONS[currentIdx].category}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {APTITUDE_QUESTIONS[currentIdx].question}
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {APTITUDE_QUESTIONS[currentIdx].options.map((opt, oIdx) => {
              const isSelected = userChoices[APTITUDE_QUESTIONS[currentIdx].id] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(APTITUDE_QUESTIONS[currentIdx].id, oIdx)}
                  type="button"
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-mono shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>

            {currentIdx < APTITUDE_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                type="button"
                className="px-5 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleFinish}
                type="button"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer"
              >
                Finish & Calculate Scores
              </button>
            )}
          </div>
        </div>
      )}

      {/* 18. COMPLETED METRICS STATE */}
      {result && !inProgress && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Score</span>
              <div className="text-3xl font-black text-amber-400 font-mono tabular-nums">
                {result.overallScore}%
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {result.correctAnswers} of {result.totalQuestions} Correct
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400">Accuracy</span>
              <div className="text-3xl font-black text-cyan-400 font-mono tabular-nums">
                {result.accuracy}%
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Precision rate</span>
            </div>

            <div>
              <span className="text-xs text-slate-400">Time Spent</span>
              <div className="text-3xl font-black text-purple-400 font-mono tabular-nums">
                {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Duration</span>
            </div>

            <div>
              <span className="text-xs text-slate-400">Incorrect</span>
              <div className="text-3xl font-black text-rose-400 font-mono tabular-nums">
                {result.totalQuestions - result.correctAnswers}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Missed items</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.categoryScores.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{cat.category}</span>
                  <span className="font-mono text-white font-bold">{cat.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      cat.score >= 75 ? 'bg-emerald-400' : cat.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-3 font-mono">
                  {cat.correct}/{cat.total} Correct
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
