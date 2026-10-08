import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { InterviewerAvatar } from '../3d/InterviewerAvatar';
import { InterviewSession } from '../../types';
import {
  HR_INTERVIEW_QUESTIONS,
  evaluateHRResponses,
} from '../../utils/interviewEvaluation';
import {
  speakText,
  stopSpeaking,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
} from '../../utils/voiceAssistant';
import {
  Users2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Clock,
  PhoneOff,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Radio,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HRInterview: React.FC = () => {
  const { state, recordInterviewSession } = useApp();

  const [inSession, setInSession] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [transcript, setTranscript] = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);
  const [seconds, setSeconds] = useState(0);

  // Hardware states
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'off' | 'live' | 'simulated'>('off');
  const [cameraErrorNotice, setCameraErrorNotice] = useState<string | null>(null);

  // Voice assistant states
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [micListeningText, setMicListeningText] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  const [collectedAnswers, setCollectedAnswers] = useState<
    { questionIndex: number; text: string }[]
  >([]);

  useEffect(() => {
    let interval: any;
    if (inSession) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [inSession]);

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    stopSpeaking();
    if (cancelSpeechRef.current) {
      cancelSpeechRef.current();
      cancelSpeechRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsAiSpeaking(false);
  };

  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, cameraStatus]);

  const speakCurrentQuestion = (text: string) => {
    if (!aiVoiceEnabled) return;
    stopSpeaking();
    setIsAiSpeaking(true);

    const cancel = speakText(text, {
      rate: 1.0,
      pitch: 1.05,
      volume: 1.0,
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
    });
    cancelSpeechRef.current = cancel;
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      setCameraStatus('off');
      setCameraErrorNotice(null);
    } else {
      setCameraErrorNotice(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });

        streamRef.current = stream;
        setCameraActive(true);
        setCameraStatus('live');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Physical camera unavailable:', err);
        setCameraActive(true);
        setCameraStatus('simulated');
        setCameraErrorNotice('Camera unavailable in current environment. Virtual Candidate Stream active.');
      }
    }
  };

  const toggleMic = async () => {
    if (micActive) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
        recognizerRef.current = null;
      }
      setMicActive(false);
      setMicListeningText('');
    } else {
      setMicActive(true);
      setMicListeningText('Listening... Speak your response now.');

      if (isSpeechRecognitionSupported()) {
        const recognizer = createSpeechRecognizer({
          onTranscript: (spokenText) => {
            setUserResponse((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
            setMicListeningText(`Heard: "${spokenText.slice(0, 45)}..."`);
          },
          onError: () => {
            setMicListeningText('Mic active. You can also type your response.');
          },
        });
        recognizerRef.current = recognizer;
        recognizer.start();
      }
    }
  };

  const handleStartSession = () => {
    stopAllMedia();
    setInSession(true);
    setCurrentQIndex(0);
    setSeconds(0);
    setUserResponse('');
    setCollectedAnswers([]);

    const welcomeMsg = `Hello ${state.user.name.split(' ')[0]}. I'm Sarah, Head of Talent Acquisition. Question 1: ${HR_INTERVIEW_QUESTIONS[0].question}`;
    setTranscript([{ sender: 'ai', text: welcomeMsg }]);
    speakCurrentQuestion(welcomeMsg);
  };

  const handleSendResponse = () => {
    if (!userResponse.trim()) return;

    const currentAnswer = userResponse.trim();
    const updatedAnswers = [
      ...collectedAnswers,
      { questionIndex: currentQIndex, text: currentAnswer },
    ];
    setCollectedAnswers(updatedAnswers);

    const newTranscript = [
      ...transcript,
      { sender: 'user' as const, text: currentAnswer },
    ];

    if (currentQIndex < HR_INTERVIEW_QUESTIONS.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      const nextQ = HR_INTERVIEW_QUESTIONS[nextIdx].question;
      const aiPrompt = `Thank you for sharing that. Next: ${nextQ}`;
      newTranscript.push({
        sender: 'ai',
        text: aiPrompt,
      });
      setUserResponse('');
      setTranscript(newTranscript);
      speakCurrentQuestion(aiPrompt);
    } else {
      const closingPrompt =
        'Thank you for your thoughtful responses. Compiling your behavioral score matrix...';
      newTranscript.push({
        sender: 'ai',
        text: closingPrompt,
      });
      setUserResponse('');
      setTranscript(newTranscript);
      speakCurrentQuestion(closingPrompt);
      setTimeout(() => endInterview(updatedAnswers), 1500);
    }
  };

  const endInterview = (finalAnswers?: typeof collectedAnswers) => {
    stopAllMedia();
    setInSession(false);
    setCameraActive(false);
    setCameraStatus('off');
    setMicActive(false);

    const answersToEvaluate =
      finalAnswers && finalAnswers.length > 0
        ? finalAnswers
        : collectedAnswers.length > 0
        ? collectedAnswers
        : [{ questionIndex: 0, text: userResponse || 'Career goals and team collaboration' }];

    // DYNAMIC HR SCORING - NO 60% CAP
    const evaluation = evaluateHRResponses(
      answersToEvaluate,
      cameraActive || cameraStatus !== 'off',
      micActive,
      seconds
    );

    const session: InterviewSession = {
      id: `hr-${Date.now()}`,
      type: 'HR',
      completedAt: new Date().toLocaleTimeString(),
      metrics: evaluation.metrics,
      overallScore: evaluation.overallScore,
      questionsAnswered: Math.max(1, currentQIndex + 1),
      durationMinutes: Math.max(1, Math.round(seconds / 60)),
    };

    recordInterviewSession(session);

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const lastHRSession = state.interviewSessions.find((s) => s.type === 'HR');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider font-mono">
            <Users2 className="w-4 h-4 text-purple-400" />
            Executive Talent & Culture Round · Sarah
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            HR & Behavioral Interview
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate leadership and culture interviews evaluated across Communication, Culture Fit,
            Emotional Intelligence, and Vision.
          </p>
        </div>

        {!inSession && (
          <button
            onClick={handleStartSession}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:opacity-95 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Users2 className="w-4 h-4" />
            <span>{lastHRSession ? 'Start New HR Session' : 'Start HR Interview'}</span>
          </button>
        )}
      </div>

      {/* INITIAL STATE */}
      {!lastHRSession && !inSession && (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
            <Users2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Behavioral Panel Ready</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Practice conversational responses, conflict resolution, and self-awareness with live
            voice assistance and camera telemetry.
          </p>

          <button
            onClick={handleStartSession}
            type="button"
            className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition cursor-pointer"
          >
            Enter Behavioral Mock Room
          </button>
        </div>
      )}

      {/* ACTIVE INTERVIEW ROOM */}
      {inSession && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 3D AI Interviewer, PIP Camera & Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-2xl h-[340px]">
              <InterviewerAvatar
                isSpeaking={isAiSpeaking}
                isListening={micActive}
                type="HR"
              />

              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-purple-400 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>Head of Talent · Sarah</span>
              </div>

              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                </span>
              </div>

              {/* USER WEBCAM PIP */}
              <div className="absolute bottom-4 right-4 z-10 w-32 h-24 rounded-2xl bg-slate-900/95 border border-purple-500/30 overflow-hidden shadow-2xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraStatus === 'live' ? 'block' : 'hidden'}`}
                />

                {cameraStatus === 'simulated' && (
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-1 text-center">
                    <UserCheck className="w-6 h-6 text-purple-400 animate-bounce mb-1" />
                    <span className="text-[9px] font-mono text-purple-300 font-bold uppercase">
                      Virtual Cam
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">Face Tracked</span>
                  </div>
                )}

                {cameraStatus === 'off' && (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                    <CameraOff className="w-5 h-5 mb-1 text-slate-600" />
                    <span className="text-[9px] font-mono text-slate-400">Camera Off</span>
                  </div>
                )}

                {cameraActive && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[8px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REC</span>
                  </div>
                )}
              </div>
            </div>

            {cameraErrorNotice && (
              <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] flex items-center gap-2 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{cameraErrorNotice}</span>
              </div>
            )}

            {/* Controls Bar */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMic}
                  type="button"
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    micActive
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                  <span>{micActive ? 'Mic Active' : 'Muted'}</span>
                </button>

                <button
                  onClick={toggleCamera}
                  type="button"
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    cameraActive
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                  }`}
                >
                  {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  <span>{cameraActive ? 'Camera On' : 'Camera Off'}</span>
                </button>

                <button
                  onClick={() => {
                    if (aiVoiceEnabled) stopSpeaking();
                    setAiVoiceEnabled(!aiVoiceEnabled);
                  }}
                  type="button"
                  title="Toggle Voice Assistant"
                  className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                    aiVoiceEnabled
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {aiVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => endInterview()}
                type="button"
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                Finish Session
              </button>
            </div>

            {micActive && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px] font-mono text-purple-300">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>{micListeningText || 'Listening to your speech...'}</span>
              </div>
            )}
          </div>

          {/* Right: Conversation Log & Input */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between h-[440px]">
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              <div className="flex items-center justify-between text-xs font-mono text-purple-400 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                <span>
                  Question {currentQIndex + 1} of {HR_INTERVIEW_QUESTIONS.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    speakCurrentQuestion(HR_INTERVIEW_QUESTIONS[currentQIndex].question)
                  }
                  className="text-[10px] text-slate-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition"
                >
                  <Volume2 className="w-3 h-3 text-purple-400" />
                  Replay Voice
                </button>
              </div>

              {transcript.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                      : 'bg-purple-500/10 border border-purple-500/30 text-purple-200 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-500 mb-1">
                    <span>{msg.sender === 'ai' ? 'Sarah (Head of Talent)' : 'You (Candidate)'}</span>
                    {msg.sender === 'ai' && idx === transcript.length - 1 && isAiSpeaking && (
                      <span className="text-purple-400 animate-pulse">● Speaking</span>
                    )}
                  </div>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                  placeholder={
                    micActive
                      ? 'Speaking via microphone... or type behavioral answer'
                      : 'Type your behavioral response here (or turn on Mic)...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-purple-400 placeholder-slate-500"
                />
                <button
                  onClick={handleSendResponse}
                  disabled={!userResponse.trim()}
                  type="button"
                  className="p-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white transition cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-slate-500 font-mono text-right">
                Focus on STAR method: Situation, Task, Action, Result
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED REPORT VIEW */}
      {lastHRSession && !inSession && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850">
              <span className="text-[11px] text-slate-400 block mb-1">Communication</span>
              <span className="text-2xl font-black text-purple-400 font-mono tabular-nums">
                {lastHRSession.metrics.communication}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850">
              <span className="text-[11px] text-slate-400 block mb-1">Confidence</span>
              <span className="text-2xl font-black text-pink-400 font-mono tabular-nums">
                {lastHRSession.metrics.confidence}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850">
              <span className="text-[11px] text-slate-400 block mb-1">Response Quality</span>
              <span className="text-2xl font-black text-cyan-400 font-mono tabular-nums">
                {lastHRSession.metrics.responseQuality}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850">
              <span className="text-[11px] text-slate-400 block mb-1">Culture Agility</span>
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                {lastHRSession.metrics.problemSolving}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-1">Overall Behavioral</span>
              <span className="text-2xl font-black text-white font-mono tabular-nums bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {lastHRSession.overallScore}%
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Behavioral Matrix Feedback
              </h3>
              <span className="text-xs font-mono text-purple-400">
                Completed at {lastHRSession.completedAt}
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {lastHRSession.metrics.feedback.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-850">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
